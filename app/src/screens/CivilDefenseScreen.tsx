import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { civilDefenseClient } from "@/api";
import { CivilDefenseList } from "@/components/civil-defense/CivilDefenseList";
import { Button } from "@/components/ui/button";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { cn } from "@/lib/utils";
import type { CivilDefenseNotice } from "@/types/civilDefense";

type CivilDefenseStatus = "loading" | "ready" | "error";

export function CivilDefenseScreen() {
  const [notices, setNotices] = useState<CivilDefenseNotice[]>([]);
  const [status, setStatus] = useState<CivilDefenseStatus>("loading");

  const fetchNotices = useCallback(async () => {
    try {
      setStatus("loading");
      const data = await civilDefenseClient.listNotices();
      setNotices(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const { containerRef, pullDistance, refreshing, isDragging, threshold, handlers } = usePullToRefresh<HTMLDivElement>({
    onRefresh: fetchNotices,
  });

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

      <FloatingBadge position="sticky">Defesa Civil</FloatingBadge>

      <div>
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">Não foi possível carregar os avisos</p>
            <Button variant="outline" onClick={fetchNotices}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {(status !== "error" || notices.length > 0) && (
          <CivilDefenseList notices={notices} loading={status === "loading"} />
        )}
      </div>
    </div>
  );
}
