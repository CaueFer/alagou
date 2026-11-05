import { Loader2, LocateFixed } from "lucide-react";
import { FloatingIconButton } from "@/components/ui/floating-icon-button";

interface LocateButtonProps {
  locating: boolean;
  onLocate: () => void;
}

export function LocateButton({ locating, onLocate }: LocateButtonProps) {
  return (
    <FloatingIconButton
      size="lg"
      onClick={onLocate}
      disabled={locating}
      aria-busy={locating}
      aria-label="Centralizar na minha localização"
      className="absolute right-4 z-[500] text-foreground"
      style={{ bottom: "calc(var(--bottom-nav-clearance) + 4rem)" }}
    >
      {locating ? <Loader2 className="h-6 w-6 animate-spin" /> : <LocateFixed className="h-6 w-6" />}
    </FloatingIconButton>
  );
}
