import { useState } from "react";
import { ChartCard } from "@/components/admin/ChartCard";
import { buildAxisScale, formatLongDate, formatShortDate, pluralizeAlerts } from "@/lib/chartScale";
import { getSeverityInfo, SEVERITY_ORDER } from "@/lib/severity";
import { cn } from "@/lib/utils";
import type { AlertTimelinePoint } from "@/types/admin";
import type { Severity } from "@/types/alert";

const SEVERITY_FILL: Record<Severity, string> = {
  MODERATE: "var(--color-severity-moderate)",
  SEVERE: "var(--color-severity-severe)",
  CRITICAL: "var(--color-severity-critical)",
};

const SEVERITY_LEGEND_ORDER = [...SEVERITY_ORDER].reverse();

function labelStep(pointCount: number): number {
  if (pointCount <= 7) return 1;
  if (pointCount <= 14) return 2;
  return 5;
}

function describePoint(point: AlertTimelinePoint): string {
  const parts = SEVERITY_LEGEND_ORDER.map(
    (severity) => `${getSeverityInfo(severity).label} ${point.bySeverity[severity]}`,
  );
  return `${formatShortDate(point.date)}: ${pluralizeAlerts(point.total)}. ${parts.join(", ")}.`;
}

interface DailyAlertsChartProps {
  timeline: AlertTimelinePoint[];
  dimmed?: boolean;
}

export function DailyAlertsChart({ timeline, dimmed }: DailyAlertsChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const largestTotal = Math.max(0, ...timeline.map((point) => point.total));
  const scale = buildAxisScale(largestTotal);
  const peakIndex = largestTotal > 0 ? timeline.findIndex((point) => point.total === largestTotal) : -1;
  const step = labelStep(timeline.length);
  const activePoint = activeIndex === null ? null : timeline[activeIndex];

  const severityTotals = SEVERITY_LEGEND_ORDER.map((severity) => ({
    severity,
    total: timeline.reduce((sum, point) => sum + point.bySeverity[severity], 0),
  }));

  const chart = (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {severityTotals.map(({ severity, total }) => (
          <li key={severity} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: SEVERITY_FILL[severity] }}
            />
            {getSeverityInfo(severity).label}
            <span className="font-semibold tabular-nums text-foreground">{total}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <div className="w-6 shrink-0 pt-6" aria-hidden="true">
          <div className="relative h-40">
            {scale.ticks.map((tick) => (
              <span
                key={tick}
                className="absolute right-0 translate-y-1/2 text-[10px] tabular-nums leading-none text-muted-foreground"
                style={{ bottom: `${(tick / scale.max) * 100}%` }}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className="relative pt-6"
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setActiveIndex(null);
            }}
          >
            <div className="relative h-40 border-b border-outline-variant">
              {scale.ticks.slice(1).map((tick) => (
                <div
                  key={tick}
                  aria-hidden="true"
                  className="absolute inset-x-0 border-t border-outline-variant/40"
                  style={{ bottom: `${(tick / scale.max) * 100}%` }}
                />
              ))}

              <div className="absolute inset-0 flex items-end">
                {timeline.map((point, index) => {
                  const topSeverity = [...SEVERITY_ORDER].reverse().find((severity) => point.bySeverity[severity] > 0);
                  const dimmedByHover = activeIndex !== null && activeIndex !== index;
                  return (
                    <div
                      key={point.date}
                      role="img"
                      aria-label={describePoint(point)}
                      tabIndex={0}
                      onPointerEnter={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onBlur={() => setActiveIndex(null)}
                      className={cn(
                        "flex h-full min-w-0 flex-1 items-end justify-center px-px focus-visible:bg-muted/70 focus-visible:outline-none",
                        activeIndex === index && "bg-muted/60",
                      )}
                    >
                      {point.total > 0 ? (
                        <div
                          className={cn(
                            "relative flex w-full max-w-6 flex-col-reverse gap-[2px] transition-opacity duration-150",
                            dimmedByHover && "opacity-50",
                          )}
                          style={{ height: `${(point.total / scale.max) * 100}%` }}
                        >
                          {index === peakIndex ? (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums leading-none text-foreground">
                              {point.total}
                            </span>
                          ) : null}
                          {SEVERITY_ORDER.map((severity) =>
                            point.bySeverity[severity] > 0 ? (
                              <div
                                key={severity}
                                className={cn("min-h-[2px]", severity === topSeverity && "rounded-t-[4px]")}
                                style={{
                                  flex: `${point.bySeverity[severity]} 1 0%`,
                                  backgroundColor: SEVERITY_FILL[severity],
                                }}
                              />
                            ) : null,
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {activePoint && activeIndex !== null ? (
              <div
                role="tooltip"
                className="pointer-events-none absolute top-2 z-20 w-40 -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-surface-container-lowest p-3 text-xs shadow-lg"
                style={{
                  left: `clamp(5rem, ${((activeIndex + 0.5) / timeline.length) * 100}%, calc(100% - 5rem))`,
                }}
              >
                <div className="text-muted-foreground">{formatLongDate(activePoint.date)}</div>
                <div className="mt-0.5 text-sm font-semibold text-foreground">{pluralizeAlerts(activePoint.total)}</div>
                <ul className="mt-2 flex flex-col gap-1">
                  {SEVERITY_LEGEND_ORDER.map((severity) => (
                    <li key={severity} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-0.5 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: SEVERITY_FILL[severity] }}
                      />
                      <span className="flex-1 text-muted-foreground">{getSeverityInfo(severity).label}</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {activePoint.bySeverity[severity]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="relative mt-1.5 flex h-4" aria-hidden="true">
            {timeline.map((point, index) => (
              <div key={point.date} className="relative min-w-0 flex-1">
                {(timeline.length - 1 - index) % step === 0 ? (
                  <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] tabular-nums leading-4 text-muted-foreground">
                    {formatShortDate(point.date)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Alertas por dia e severidade</caption>
        <thead>
          <tr className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            <th scope="col" className="pb-2 pr-3 font-bold">
              Dia
            </th>
            {SEVERITY_ORDER.map((severity) => (
              <th key={severity} scope="col" className="pb-2 pr-3 text-right font-bold">
                {getSeverityInfo(severity).label}
              </th>
            ))}
            <th scope="col" className="pb-2 text-right font-bold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((point) => (
            <tr key={point.date} className="border-t border-border/60">
              <th scope="row" className="py-2 pr-3 font-medium text-foreground">
                {formatShortDate(point.date)}
              </th>
              {SEVERITY_ORDER.map((severity) => (
                <td key={severity} className="py-2 pr-3 text-right tabular-nums text-muted-foreground">
                  {point.bySeverity[severity]}
                </td>
              ))}
              <td className="py-2 text-right font-semibold tabular-nums text-foreground">{point.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return <ChartCard eyebrow="Tendência" title="Alertas por dia" chart={chart} table={table} dimmed={dimmed} />;
}
