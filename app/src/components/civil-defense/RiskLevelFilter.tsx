import { FilterChip } from "@/components/ui/filter-chip";
import { getRiskLevelInfo, RISK_LEVEL_ORDER } from "@/lib/riskLevel";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/civilDefense";

interface RiskLevelFilterProps {
  selected: ReadonlySet<RiskLevel>;
  counts: Record<RiskLevel, number>;
  onToggle: (level: RiskLevel) => void;
}

export function RiskLevelFilter({ selected, counts, onToggle }: RiskLevelFilterProps) {
  return (
    <div role="group" aria-label="Filtrar por nível de risco" className="flex flex-wrap gap-2 px-4 py-3">
      {RISK_LEVEL_ORDER.map((level) => {
        const info = getRiskLevelInfo(level);
        return (
          <FilterChip
            key={level}
            active={selected.has(level)}
            activeClassName={cn(info.containerBgClass, info.containerTextClass)}
            indicatorClassName={info.bgClass}
            onClick={() => onToggle(level)}
          >
            {info.label}
            <span className="tabular-nums opacity-70">{counts[level]}</span>
          </FilterChip>
        );
      })}
    </div>
  );
}
