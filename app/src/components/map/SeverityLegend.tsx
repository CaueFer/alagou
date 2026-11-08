import { getSeverityInfo } from "@/lib/severity";
import { SEVERITY_ORDER } from "@/lib/severity";

export function SeverityLegend() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">Severidade</h3>
      <div className="space-y-2.5">
        {SEVERITY_ORDER.map((severity) => {
          const { label, description, markerColor } = getSeverityInfo(severity);
          return (
            <div key={severity} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: markerColor }} />
                <p className="text-sm font-medium text-foreground">{label}</p>
              </div>
              <p className="pl-6 text-xs text-muted-foreground">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
