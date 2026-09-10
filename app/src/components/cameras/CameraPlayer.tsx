import { useEffect, useState } from "react";
import { RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHlsPlayer } from "@/hooks/useHlsPlayer";
import { cn } from "@/lib/utils";
import type { Camera } from "@/types/camera";

async function lockLandscape() {
  try {
    await screen.orientation?.lock?.("landscape");
  } catch {
  }
}

function unlockOrientation() {
  try {
    screen.orientation?.unlock?.();
  } catch {
  }
}

interface CameraPlayerProps {
  camera: Camera | null;
  loading: boolean;
  fullscreen?: boolean;
  onClose?: () => void;
  onError?: () => void;
}

export function CameraPlayer({ camera, loading, fullscreen = false, onClose, onError }: CameraPlayerProps) {
  const { videoRef, status, retry } = useHlsPlayer(camera?.streamUrl ?? "", camera !== null);
  const [spinOnce, setSpinOnce] = useState(false);
  const reloadSpinning = spinOnce || status === "connecting";

  function handleReload() {
    setSpinOnce(true);
    retry();
  }

  useEffect(() => {
    return () => unlockOrientation();
  }, []);

  useEffect(() => {
    if (status === "error" && onError) {
      onError();
    }
  }, [status, onError]);

  useEffect(() => {
    if (!fullscreen || !camera || !onClose) {
      return;
    }
    const handleClose = onClose;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen, camera, onClose]);

  if (fullscreen && !camera) {
    return null;
  }

  if (!camera) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {loading ? (
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
        ) : (
          <p className="px-8 text-center text-sm text-muted-foreground">Nenhuma câmera disponível</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", fullscreen && "fixed inset-0 z-[1100] bg-black")}
    >
      <video ref={videoRef} className="h-full w-full object-contain" playsInline />

      {status === "connecting" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-8 text-center">
          <p className="text-sm text-white">Não foi possível carregar esta câmera</p>
          <Button onClick={retry}>Tentar novamente</Button>
        </div>
      )}

      {status !== "error" && (
        <div
          className={cn(
            "absolute left-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md",
            fullscreen
              ? "border-white/20 bg-black/50 text-white"
              : "border-white/40 bg-white/70 text-foreground shadow-lg",
          )}
          style={
            fullscreen ? { top: "calc(env(safe-area-inset-top) + 1rem)" } : { bottom: "var(--bottom-nav-clearance)" }
          }
        >
          {status === "live" ? (
            <>
              <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
              AO VIVO
            </>
          ) : (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-severity-moderate" aria-hidden="true" />
              Reconectando
            </>
          )}
        </div>
      )}

      {status !== "error" && !fullscreen && (
        <div
          className="absolute right-3 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/70 px-2.5 py-1 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md"
          style={{ bottom: "var(--bottom-nav-clearance)" }}
        >
          <span className="max-w-[55vw] truncate">{camera.name}</span>
          <button
            type="button"
            onClick={handleReload}
            aria-label="Recarregar câmera"
            className="-mr-0.5 shrink-0 text-foreground/70 transition-colors hover:text-foreground active:scale-90"
          >
            <RotateCw
              className={cn("h-3.5 w-3.5", reloadSpinning && "animate-spin")}
              onAnimationIteration={() => setSpinOnce(false)}
            />
          </button>
        </div>
      )}

      {fullscreen && (
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
        >
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={onClose}
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <span className="max-w-[60%] truncate rounded-full border border-white/20 bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-md">
            {camera.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={lockLandscape}
            aria-label="Girar para paisagem"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
