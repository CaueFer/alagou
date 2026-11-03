import { FilterChip } from "@/components/ui/filter-chip";
import { ALERT_TYPE_ORDER, getAlertTypeInfo } from "@/lib/alertType";
import { cn } from "@/lib/utils";
import type { RecentAlertType } from "@/types/recentAlert";

interface AlertTypeFilterProps {
  selected: ReadonlySet<RecentAlertType>;
  counts: Record<RecentAlertType, number>;
  onToggle: (type: RecentAlertType) => void;
}

export function AlertTypeFilter({ selected, counts, onToggle }: AlertTypeFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por tipo de alerta"
      className="flex flex-wrap gap-1 px-4 py-3"
    >
      {ALERT_TYPE_ORDER.map((type) => {
        const info = getAlertTypeInfo(type);
        return (
          <FilterChip
            key={type}
            active={selected.has(type)}
            activeClassName={cn("border-outline-variant bg-surface-container-lowest", info.containerTextClass)}
            indicatorClassName={info.bgClass}
            className="flex-auto justify-center gap-1 px-2 text-[13px] whitespace-nowrap active:scale-95"
            onClick={() => onToggle(type)}
          >
            {info.label}
            <span className="tabular-nums opacity-70">{counts[type]}</span>
          </FilterChip>
        );
      })}
    </div>
  );
}
