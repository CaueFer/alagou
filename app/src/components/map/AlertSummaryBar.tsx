import { getSeverityInfo } from "@/lib/severity";
import { SEVERITY_ORDER } from "@/lib/severity";
import type { Alert } from "@/types/alert";

interface AlertSummaryBarProps {
  alerts: Alert[];
}

export function AlertSummaryBar({ alerts }: AlertSummaryBarProps) {
  if (alerts.length === 0) {
    return (
      <div className="pointer-events-none absolute top-4 left-1/2 z-[500] -translate-x-1/2 rounded-2xl border border-white/40 bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground shadow-lg backdrop-blur-md">
        Nenhum alagamento ativo
      </div>
    );
  }

  const severityCounts = SEVERITY_ORDER.map((severity) => ({
    severity,
    count: alerts.filter((a) => a.severity === severity).length,
  })).filter((s) => s.count > 0);

  return (
    <div className="pointer-events-none absolute top-4 left-1/2 z-[500] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/40 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-md">
      <span className="text-sm font-medium text-foreground">
        {alerts.length} {alerts.length === 1 ? "alagamento" : "alagamentos"} ativo{alerts.length === 1 ? "" : "s"}
      </span>
      <div className="flex items-center gap-1.5">
        {severityCounts.map(({ severity, count }) => {
          const { markerColor } = getSeverityInfo(severity);
          return (
            <div key={severity} className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: markerColor }} />
              <span className="text-xs font-medium text-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
