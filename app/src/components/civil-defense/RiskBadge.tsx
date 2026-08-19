import { getRiskLevelInfo } from "@/lib/riskLevel";
import type { RiskLevel } from "@/types/civilDefense";

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const info = getRiskLevelInfo(level);

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-[12px] font-bold uppercase leading-4 tracking-[0.05em] ${info.containerBgClass} ${info.containerTextClass}`}
    >
      {info.label}
    </span>
  );
}
