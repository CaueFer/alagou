import { Layers } from "lucide-react";

interface ZonesToggleButtonProps {
  visible: boolean;
  onToggle: () => void;
}

export function ZonesToggleButton({ visible, onToggle }: ZonesToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Exibir zonas de risco"
      aria-pressed={visible}
      className="absolute left-4 z-[500] flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/80 shadow-lg backdrop-blur-md transition-colors hover:bg-white/90"
      style={{ bottom: "calc(var(--bottom-nav-clearance) + 4rem)" }}
    >
      <Layers className={`h-6 w-6 ${visible ? "text-foreground" : "text-foreground/40"}`} />
    </button>
  );
}
