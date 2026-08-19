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
        const active = selected.has(type);
        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(type)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? cn("border-transparent", info.containerBgClass, info.containerTextClass)
                : "border-border bg-surface-container-lowest text-muted-foreground",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", active ? info.bgClass : "bg-muted-foreground/40")} />
            {info.label}
          </button>
        );
      })}
    </div>
  );
}
