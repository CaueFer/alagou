import { Layers } from "lucide-react";
import { FloatingIconButton } from "@/components/ui/floating-icon-button";

interface ZonesToggleButtonProps {
  visible: boolean;
  onToggle: () => void;
}

export function ZonesToggleButton({ visible, onToggle }: ZonesToggleButtonProps) {
  return (
    <FloatingIconButton
      size="lg"
      onClick={onToggle}
      aria-label="Exibir zonas de risco"
      aria-pressed={visible}
      className="absolute left-4 z-[500]"
      style={{ bottom: "calc(var(--bottom-nav-clearance) + 4rem)" }}
    >
      <Layers className={`h-6 w-6 ${visible ? "text-foreground" : "text-foreground/40"}`} />
    </FloatingIconButton>
  );
}
