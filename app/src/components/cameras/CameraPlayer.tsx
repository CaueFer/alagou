import { useEffect } from "react";
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
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black">
        {loading ? (
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <p className="px-8 text-center text-sm text-white/70">Nenhuma câmera disponível</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-black",
        fullscreen ? "fixed inset-0 z-[1100]" : "rounded-2xl shadow-lg",
      )}
    >
      <video ref={videoRef} className="h-full w-full object-contain" playsInline controls={status === "live"} />

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

      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3"
        style={fullscreen ? { paddingTop: "calc(env(safe-area-inset-top) + 1rem)" } : undefined}
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
    </div>
  );
}
