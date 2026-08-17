import { cn } from "@/lib/utils"
import { severityColor } from "@/utils/severityColor"
import type { Severity } from "@/types"

interface SeverityBadgeProps {
  severity: Severity
  className?: string
}

// Reused as the Defesa Civil RiskBadge too — see design.md "Severity scale".
export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const { containerBg, containerText, label } = severityColor(severity)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-label-caps uppercase",
        containerBg,
        containerText,
        className
      )}
    >
      {label}
    </span>
  )
}
