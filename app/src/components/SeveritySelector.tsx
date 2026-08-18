import { cn } from "@/lib/utils"
import { severityColor } from "@/utils/severityColor"
import type { Severity } from "@/types"

const options: { severity: Severity; description: string }[] = [
  { severity: "MODERADO", description: "Trânsito lento, cuidado ao passar" },
  { severity: "GRAVE", description: "Via parcialmente bloqueada" },
  { severity: "CRITICO", description: "Via totalmente bloqueada ou risco de vida" },
]

interface SeveritySelectorProps {
  value: Severity | null
  onChange: (severity: Severity) => void
}

export function SeveritySelector({ value, onChange }: SeveritySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(({ severity, description }) => {
        const { containerBg, containerText, label } = severityColor(severity)
        const selected = value === severity

        return (
          <button
            key={severity}
            type="button"
            onClick={() => onChange(severity)}
            className={cn(
              "flex min-h-touch-target-min flex-col gap-1 rounded p-2 text-left",
              containerBg,
              containerText,
              selected ? "ring-2 ring-blue-500" : "opacity-70"
            )}
          >
            <span className="text-label-caps uppercase">{label}</span>
            <span className="text-[11px] leading-tight">{description}</span>
          </button>
        )
      })}
    </div>
  )
}
