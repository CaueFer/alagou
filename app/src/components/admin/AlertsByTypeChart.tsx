import { ChartCard } from "@/components/admin/ChartCard";
import { pluralizeAlerts } from "@/lib/chartScale";
import { ALERT_TYPE_ORDER, getAlertTypeInfo } from "@/lib/alertType";
import { cn } from "@/lib/utils";
import type { AlertTimelinePoint } from "@/types/admin";

interface AlertsByTypeChartProps {
  timeline: AlertTimelinePoint[];
  dimmed?: boolean;
}

export function AlertsByTypeChart({ timeline, dimmed }: AlertsByTypeChartProps) {
  const rows = ALERT_TYPE_ORDER.map((type) => ({
    type,
    info: getAlertTypeInfo(type),
    total: timeline.reduce((sum, point) => sum + point.byType[type], 0),
  }));
  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);
  const largestTotal = Math.max(1, ...rows.map((row) => row.total));

  const chart = (
    <ul className="flex flex-col gap-1">
      {rows.map(({ type, info, total }) => {
        const share = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
        const Icon = info.icon;
        return (
          <li
            key={type}
            tabIndex={0}
            aria-label={`${info.label}: ${pluralizeAlerts(total)}, ${share}% do total`}
            className="group relative flex items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
          >
            <span className="flex w-28 shrink-0 items-center gap-2 text-sm text-foreground">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {info.label}
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-2 border-l border-outline-variant">
              <div
                className={cn(
                  "h-3 shrink-0 rounded-r-[4px] transition-opacity duration-150 group-hover:opacity-80",
                  info.bgClass,
                )}
                style={{ width: `calc((100% - 2.25rem) * ${total / largestTotal})` }}
              />
              <span className="text-sm font-semibold tabular-nums text-foreground">{total}</span>
            </div>
            <div
              role="tooltip"
              className="pointer-events-none absolute right-1 top-0 z-20 -translate-y-full rounded-xl border border-border bg-surface-container-lowest px-3 py-2 text-xs opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <span className="font-semibold text-foreground">{pluralizeAlerts(total)}</span>
              <span className="ml-1.5 text-muted-foreground">{share}% do total</span>
            </div>
          </li>
        );
      })}
    </ul>
  );

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Alertas por origem</caption>
        <thead>
          <tr className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            <th scope="col" className="pb-2 pr-3 font-bold">
              Origem
            </th>
            <th scope="col" className="pb-2 pr-3 text-right font-bold">
              Alertas
            </th>
            <th scope="col" className="pb-2 text-right font-bold">
              Parcela
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ type, info, total }) => (
            <tr key={type} className="border-t border-border/60">
              <th scope="row" className="py-2 pr-3 font-medium text-foreground">
                {info.label}
              </th>
              <td className="py-2 pr-3 text-right font-semibold tabular-nums text-foreground">{total}</td>
              <td className="py-2 text-right tabular-nums text-muted-foreground">
                {grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return <ChartCard eyebrow="Origem" title="Alertas por origem" chart={chart} table={table} dimmed={dimmed} />;
}
