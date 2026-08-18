import Hls from "hls.js";
import { Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Camera } from "@/types/camera";

type PlayerStatus = "connecting" | "live" | "error";

interface CameraPlayerProps {
  camera: Camera;
  onClose: () => void;
}

export function CameraPlayer({ camera, onClose }: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<PlayerStatus>("connecting");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setStatus("connecting");
    let hls: Hls | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = camera.streamUrl;
      void video.play().catch(() => setStatus("error"));
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(camera.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => setStatus("error"));
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setStatus("error");
      });
    } else {
      setStatus("error");
    }

    const handlePlaying = () => setStatus("live");
    const handleError = () => setStatus("error");
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [camera.streamUrl, attempt]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex min-w-0 items-center gap-2">
          {status === "live" && (
            <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-red-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              AO VIVO
            </span>
          )}
          <p className="truncate text-sm font-medium text-white">{camera.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <video ref={videoRef} className="h-full w-full object-contain" controls playsInline muted />

        {status === "connecting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Conectando...</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="text-sm text-white">Não foi possível carregar esta câmera</p>
            <Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
