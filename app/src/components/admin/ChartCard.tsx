import { BarChart3, Table2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  eyebrow: string;
  title: string;
  chart: ReactNode;
  table: ReactNode;
  dimmed?: boolean;
}

export function ChartCard({ eyebrow, title, chart, table, dimmed = false }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  const ToggleIcon = showTable ? BarChart3 : Table2;

  return (
    <figure className="m-0 flex flex-col gap-4 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{eyebrow}</span>
          <figcaption className="text-lg font-semibold leading-snug text-foreground">{title}</figcaption>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((current) => !current)}
          aria-pressed={showTable}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ToggleIcon className="h-4 w-4" aria-hidden="true" />
          {showTable ? "Ver gráfico" : "Ver tabela"}
        </button>
      </div>

      <div className={cn("transition-opacity duration-150", dimmed && "opacity-60")}>{showTable ? table : chart}</div>
    </figure>
  );
}
