import { FilterChip } from "@/components/ui/filter-chip";
import { ALERT_TYPE_ORDER, getAlertTypeInfo } from "@/lib/alertType";
import { cn } from "@/lib/utils";
import type { RecentAlertType } from "@/types/recentAlert";

interface AlertTypeFilterProps {
  selected: ReadonlySet<RecentAlertType>;
  onToggle: (type: RecentAlertType) => void;
}

export function AlertTypeFilter({ selected, onToggle }: AlertTypeFilterProps) {
  return (
    <div className="flex gap-2 py-3">
      {ALERT_TYPE_ORDER.map((type) => {
        const info = getAlertTypeInfo(type);
        return (
          <FilterChip
            key={type}
            active={selected.has(type)}
            activeClassName={cn(info.containerBgClass, info.containerTextClass)}
            indicatorClassName={info.bgClass}
            onClick={() => onToggle(type)}
          >
            {info.label}
          </FilterChip>
        );
      })}
    </div>
  );
}
