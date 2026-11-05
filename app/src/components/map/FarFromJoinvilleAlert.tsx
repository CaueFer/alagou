import { MapPinOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { glassSurfaceClass } from "@/components/ui/floating-icon-button";
import { cn } from "@/lib/utils";

interface FarFromJoinvilleAlertProps {
  onGoToJoinville: () => void;
  onDismiss: () => void;
}

export function FarFromJoinvilleAlert({ onGoToJoinville, onDismiss }: FarFromJoinvilleAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "absolute inset-x-4 top-[5.5rem] z-[500] mx-auto max-w-md rounded-2xl border p-4",
        glassSurfaceClass,
      )}
    >
      <div className="flex items-start gap-3">
        <MapPinOff className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Você está longe de Joinville</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            O Alagou mostra alagamentos apenas em Joinville.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <Button size="sm" onClick={onGoToJoinville} className="mt-3 w-full">
        Ir para Joinville
      </Button>
    </div>
  );
}
