import { cn } from "@/lib/utils";
import { getSeverityInfo, SEVERITY_ORDER } from "@/lib/severity";
import type { Severity } from "@/types/alert";

interface SeveritySelectorProps {
  value: Severity | null;
  onChange: (severity: Severity) => void;
}

export function SeveritySelector({ value, onChange }: SeveritySelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2 px-4">
      {SEVERITY_ORDER.map((severity) => {
        const info = getSeverityInfo(severity);
        const selected = value === severity;
        return (
          <button
            key={severity}
            type="button"
            onClick={() => onChange(severity)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-colors",
              selected ? "border-foreground" : "border-border",
            )}
            style={{ backgroundColor: selected ? `${info.markerColor}1A` : undefined }}
          >
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: info.markerColor }}
            >
              {info.label}
            </span>
            <span className="text-sm text-muted-foreground">{info.description}</span>
          </button>
        );
      })}
    </div>
  );
}
