import { CheckCircle2 } from "lucide-react";
import { AlertsByTypeChart } from "@/components/admin/AlertsByTypeChart";
import { DailyAlertsChart } from "@/components/admin/DailyAlertsChart";
import { Button } from "@/components/ui/button";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import type { AdminDataStatus } from "@/hooks/useAdminData";
import type { AlertTimelinePoint } from "@/types/admin";

const PERIOD_OPTIONS: SegmentedOption<number>[] = [
  { value: 7, label: "7 dias" },
  { value: 14, label: "14 dias" },
  { value: 30, label: "30 dias" },
];

interface AlertChartsSectionProps {
  timeline: AlertTimelinePoint[];
  status: AdminDataStatus;
  days: number;
  onDaysChange: (days: number) => void;
  onRetry: () => void;
}

export function AlertChartsSection({ timeline, status, days, onDaysChange, onRetry }: AlertChartsSectionProps) {
  const hasData = timeline.length > 0;
  const totalAlerts = timeline.reduce((sum, point) => sum + point.total, 0);
  const isTransitioning = hasData && timeline.length !== days;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Gráficos</span>
          <h2 className="text-lg font-semibold text-foreground">Alertas no período</h2>
        </div>
        <SegmentedControl options={PERIOD_OPTIONS} value={days} onValueChange={onDaysChange} />
      </div>

      {!hasData && status === "loading" ? (
        <div
          aria-busy="true"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-sm"
        >
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : null}

      {!hasData && status === "error" ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-severity-critical/30 bg-severity-critical-container p-4 text-sm text-severity-critical">
          <span>Não foi possível carregar os gráficos.</span>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {hasData && totalAlerts === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-sm">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-status-safe" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Nenhum alerta nos últimos {days} dias. Joinville está tranquila.
          </p>
        </div>
      ) : null}

      {hasData && totalAlerts > 0 ? (
        <>
          <DailyAlertsChart timeline={timeline} dimmed={isTransitioning} />
          <AlertsByTypeChart timeline={timeline} dimmed={isTransitioning} />
        </>
      ) : null}
    </section>
  );
}
