import { useState } from "react";
import { Info } from "lucide-react";
import { getSeverityInfo } from "@/lib/severity";
import { SEVERITY_ORDER } from "@/lib/severity";

export function SeverityLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-[500]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-lg backdrop-blur-md transition-colors hover:bg-white/90"
        aria-label="Legenda de severidade"
      >
        <Info className="h-5 w-5 text-foreground" />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-56 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-lg backdrop-blur-md">
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
      )}
    </div>
  );
}
