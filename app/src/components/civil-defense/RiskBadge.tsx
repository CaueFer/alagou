import { getRiskLevelInfo } from "@/lib/riskLevel";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/civilDefense";

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const info = getRiskLevelInfo(level);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-outline-variant bg-surface-container-lowest px-2.5 py-1 text-sm font-semibold",
        info.containerTextClass,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", info.bgClass)} aria-hidden="true" />
      {info.label}
    </span>
  );
}
