import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AlertDetailSheet } from "@/components/alert-detail/AlertDetailSheet";
import { AlertFeed } from "@/components/alert-feed/AlertFeed";
import { AlertTypeFilter } from "@/components/alert-feed/AlertTypeFilter";
import { ClimaticDetailModal } from "@/components/alert-feed/ClimaticDetailModal";
import { Button } from "@/components/ui/button";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { useConfirmation } from "@/hooks/useConfirmation";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useRecentAlerts } from "@/hooks/useRecentAlerts";
import { ALERT_TYPE_ORDER } from "@/lib/alertType";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types/alert";
import type { ClimaticZoneSnapshot, RecentAlert, RecentAlertType } from "@/types/recentAlert";

export function RecentAlertsScreen() {
  const { alerts, status, refetch } = useRecentAlerts();
  const { confirm, reportClear, pendingAction } = useConfirmation();
  const { containerRef, pullDistance, refreshing, isDragging, threshold, handlers } = usePullToRefresh<HTMLDivElement>({
    onRefresh: refetch,
  });

  const [selectedTypes, setSelectedTypes] = useState<Set<RecentAlertType>>(new Set(ALERT_TYPE_ORDER));
  const [selectedUserAlert, setSelectedUserAlert] = useState<Alert | null>(null);
  const [selectedZone, setSelectedZone] = useState<ClimaticZoneSnapshot | null>(null);

  function handleToggleType(type: RecentAlertType) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function handleSelect(item: RecentAlert) {
    if (item.type === "USER" && item.userAlert) {
      setSelectedUserAlert(item.userAlert);
    } else if (item.type === "CIVIL_DEFENSE" && item.civilDefenseNotice) {
      window.open(item.civilDefenseNotice.link, "_blank", "noopener,noreferrer");
    } else if (item.type === "CLIMATIC" && item.climaticZone) {
      setSelectedZone(item.climaticZone);
    }
  }

  async function handleConfirm(id: string) {
    const updated = await confirm(id);
    setSelectedUserAlert(updated);
  }

  async function handleReportClear(id: string) {
    const result = await reportClear(id);
    if (result.removed) {
      setSelectedUserAlert(null);
      refetch();
    } else if (result.alert) {
      setSelectedUserAlert(result.alert);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-y-auto"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
      onTouchStart={handlers.onTouchStart}
      onTouchMove={handlers.onTouchMove}
      onTouchEnd={handlers.onTouchEnd}
    >
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ height: pullDistance, transition: isDragging ? "none" : "height 200ms ease" }}
      >
        <RefreshCw
          className={cn("h-5 w-5 text-muted-foreground", refreshing && "animate-spin")}
          style={{
            opacity: Math.min(pullDistance / threshold, 1),
            transform: refreshing ? undefined : `rotate(${(pullDistance / threshold) * 360}deg)`,
          }}
        />
      </div>

      <FloatingBadge position="sticky">Alertas Recentes</FloatingBadge>

      <div className="px-4">
        <AlertTypeFilter selected={selectedTypes} onToggle={handleToggleType} />

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">Não foi possível carregar os alertas</p>
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        )}

        {(status !== "error" || alerts.length > 0) && (
          <AlertFeed
            alerts={alerts}
            loading={status === "loading"}
            selectedTypes={selectedTypes}
            onSelect={handleSelect}
          />
        )}
      </div>

      <AlertDetailSheet
        alert={selectedUserAlert}
        open={selectedUserAlert !== null}
        onOpenChange={(open) => !open && setSelectedUserAlert(null)}
        onConfirm={handleConfirm}
        onReportClear={handleReportClear}
        pendingAction={pendingAction}
      />

      <ClimaticDetailModal zone={selectedZone} open={selectedZone !== null} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
