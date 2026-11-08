import { useEffect, useState } from "react";
import { Expand, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHlsPlayer } from "@/hooks/useHlsPlayer";
import { cn } from "@/lib/utils";
import type { Camera } from "@/types/camera";

const STAGE_SIZE = "aspect-video w-full max-h-[calc(var(--app-height,100dvh)*0.6)]";
const STAGE_CONTROL =
  "inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

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
  autoLandscape?: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  onError?: () => void;
}

export function CameraPlayer({
  camera,
  loading,
  fullscreen = false,
  autoLandscape = false,
  onClose,
  onExpand,
  onError,
}: CameraPlayerProps) {
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
    if (!autoLandscape || !camera) {
      return;
    }
    lockLandscape();
    return () => unlockOrientation();
  }, [autoLandscape, camera]);

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
      <div className={cn("flex items-center justify-center bg-black", STAGE_SIZE)}>
        {loading ? (
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <p className="px-8 text-center text-sm text-white/80">Nenhuma câmera disponível</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-black",
        fullscreen
          ? "fixed inset-0 z-[1100] h-full w-full animate-[camera-fullscreen-in_320ms_ease-out]"
          : STAGE_SIZE,
      )}
    >
      <video ref={videoRef} className="h-full w-full object-contain" playsInline muted />

      {status === "connecting" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-8 text-center">
          <p className="text-sm text-white">Não foi possível carregar esta câmera</p>
          <Button variant="secondary" className="rounded-full" onClick={retry}>
            Tentar novamente
          </Button>
        </div>
      )}

      {status !== "error" && (
        <div
          className="absolute inset-x-3 flex items-center justify-between gap-2"
          style={{ bottom: fullscreen ? "calc(env(safe-area-inset-bottom) + 1rem)" : "0.75rem" }}
        >
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-white">
            {status === "live" ? (
              <>
                <span className="h-2 w-2 rounded-full bg-live-indicator" aria-hidden="true" />
                Ao vivo
              </>
            ) : (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-severity-moderate" aria-hidden="true" />
                Conectando
              </>
            )}
          </div>

          {!fullscreen && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleReload} aria-label="Recarregar câmera" className={STAGE_CONTROL}>
                <RotateCw
                  className={cn("h-5 w-5", reloadSpinning && "animate-spin")}
                  onAnimationIteration={() => setSpinOnce(false)}
                />
              </button>
              {onExpand && (
                <button type="button" onClick={onExpand} aria-label="Tela cheia em paisagem" className={STAGE_CONTROL}>
                  <Expand className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
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
