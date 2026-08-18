import { useEffect } from "react";
import { RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHlsPlayer } from "@/hooks/useHlsPlayer";
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
  open: boolean;
  onClose: () => void;
}

export function CameraPlayer({ camera, open, onClose }: CameraPlayerProps) {
  const { videoRef, status, retry } = useHlsPlayer(camera?.streamUrl ?? "", open && camera !== null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      unlockOrientation();
    }
    return () => unlockOrientation();
  }, [open]);

  if (!open || !camera) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[700] flex flex-col bg-black">
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
        className="absolute inset-x-0 top-0 flex items-center justify-between p-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </Button>
        <span className="max-w-[60%] truncate rounded-full bg-black/50 px-3 py-1 text-sm text-white">
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
