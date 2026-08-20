import { useCallback, useEffect, useState } from "react";
import { ListVideo, RefreshCw } from "lucide-react";
import { cameraClient } from "@/api";
import { CameraListDrawer } from "@/components/cameras/CameraListDrawer";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { Button } from "@/components/ui/button";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { pickDefaultCamera, setLastSelectedCameraId } from "@/lib/cameraPreference";
import type { Camera } from "@/types/camera";

type CamerasStatus = "loading" | "ready" | "error";

export function CamerasScreen() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [status, setStatus] = useState<CamerasStatus>("loading");
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isOnline = useOnlineStatus();

  const fetchCameras = useCallback(async () => {
    try {
      setStatus("loading");
      const data = await cameraClient.list();
      setCameras(data);
      setSelectedCamera((current) => current ?? pickDefaultCamera(data));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  const markUnavailable = useCallback((id: string) => {
    setUnavailableIds((prev) => new Set(prev).add(id));
  }, []);

  function handleSelectCamera(camera: Camera) {
    setSelectedCamera(camera);
    setLastSelectedCameraId(camera.id);
    setIsDrawerOpen(false);
  }

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-tl from-primary-container/15 via-surface-container to-background"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      {!isOnline && (
        <div className="z-10 bg-offline-banner px-4 py-2 text-center text-sm font-medium text-offline-banner-foreground">
          Você está offline — câmeras indisponíveis
        </div>
      )}

      <FloatingBadge>Câmeras em Tempo Real</FloatingBadge>

      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="absolute top-4 left-4 z-[500] flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-lg backdrop-blur-md transition-colors hover:bg-white/90"
        aria-label="Selecionar câmera"
      >
        <ListVideo className="h-5 w-5 text-foreground" />
      </button>

      <div className="min-h-0 flex-1 px-4 pb-4 pt-16">
        {status === "error" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">Não foi possível carregar as câmeras</p>
            <Button variant="outline" onClick={fetchCameras}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        ) : (
          <CameraPlayer
            camera={selectedCamera}
            loading={status === "loading"}
            onError={() => selectedCamera && markUnavailable(selectedCamera.id)}
          />
        )}
      </div>

      <CameraListDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        cameras={cameras}
        loading={status === "loading"}
        locked={!isOnline}
        unavailableIds={unavailableIds}
        selectedCameraId={selectedCamera?.id ?? null}
        onSelect={handleSelectCamera}
      />
    </div>
  );
}
