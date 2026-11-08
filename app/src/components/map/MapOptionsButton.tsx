import { useEffect, useRef, useState } from "react";
import { Layers } from "lucide-react";
import { SeverityLegend } from "@/components/map/SeverityLegend";
import { FloatingIconButton, glassSurfaceClass } from "@/components/ui/floating-icon-button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface MapOptionsButtonProps {
  zonesVisible: boolean;
  onToggleZones: () => void;
}

export function MapOptionsButton({ zonesVisible, onToggleZones }: MapOptionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="absolute left-4 z-[500]"
      style={{ bottom: "calc(var(--bottom-nav-clearance) + 4rem)" }}
    >
      <FloatingIconButton
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Zonas de risco e legenda"
        aria-expanded={isOpen}
      >
        <Layers className="h-6 w-6 text-foreground" />
      </FloatingIconButton>

      {isOpen && (
        <div
          className={cn("absolute bottom-16 left-0 w-64 space-y-3 overflow-y-auto rounded-2xl p-4", glassSurfaceClass)}
          style={{ maxHeight: "calc(var(--app-height, 100dvh) - var(--bottom-nav-clearance) - 10rem)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-foreground">Zonas de risco</span>
            <Switch checked={zonesVisible} onCheckedChange={onToggleZones} aria-label="Exibir zonas de risco" />
          </div>
          <div className="border-t border-outline-variant/40 pt-3">
            <SeverityLegend />
          </div>
        </div>
      )}
    </div>
  );
}
