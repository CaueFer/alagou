import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Expand, ListVideo, MapPin, RefreshCw } from "lucide-react";
import { cameraClient } from "@/api";
import { CameraListDrawer } from "@/components/cameras/CameraListDrawer";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { Button } from "@/components/ui/button";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { FloatingIconButton } from "@/components/ui/floating-icon-button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { pickDefaultCamera, setLastSelectedCameraId } from "@/lib/cameraPreference";
import { cn } from "@/lib/utils";
import type { Camera } from "@/types/camera";

const CONTROL_SURFACE = "border-white/60 bg-white/95 hover:bg-white transition-all duration-300 ease-in";
const FLY_TOP_LEFT = "pointer-events-none -translate-x-24 -translate-y-16 -rotate-12 scale-50 opacity-0";
const FLY_TOP_RIGHT = "pointer-events-none translate-x-24 -translate-y-16 rotate-12 scale-50 opacity-0";
const FLY_BOTTOM_RIGHT = "pointer-events-none translate-x-24 translate-y-16 rotate-12 scale-50 opacity-0";

type CamerasStatus = "loading" | "ready" | "error";

export function CamerasScreen() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [status, setStatus] = useState<CamerasStatus>("loading");
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

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

  function handleLocateOnMap() {
    if (!selectedCamera) {
      return;
    }
    navigate("/", { state: { focusLocation: { lat: selectedCamera.lat, lng: selectedCamera.lng } } });
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <CameraPlayer
        camera={selectedCamera}
        loading={status === "loading"}
        fullscreen={isFullscreen}
        autoLandscape={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        onError={() => selectedCamera && markUnavailable(selectedCamera.id)}
      />

      {!isOnline && (
        <div className="absolute inset-x-0 top-0 z-10 bg-offline-banner px-4 py-2 text-center text-sm font-medium text-offline-banner-foreground">
          Você está offline — câmeras indisponíveis
        </div>
      )}

      <FloatingBadge
        className={cn(
          "border-white/60 bg-white/95 text-foreground transition-all duration-300 ease-in",
          isFullscreen && "-translate-y-20 opacity-0",
        )}
      >
        Câmeras em Tempo Real
      </FloatingBadge>

      <FloatingIconButton
        onClick={() => setIsDrawerOpen(true)}
        className={cn("absolute top-4 left-4 z-[500]", CONTROL_SURFACE, isFullscreen && FLY_TOP_LEFT)}
        aria-label="Selecionar câmera"
      >
        <ListVideo className="h-5 w-5 text-foreground" />
      </FloatingIconButton>

      {selectedCamera && status === "ready" && (
        <FloatingIconButton
          onClick={handleLocateOnMap}
          className={cn("absolute top-4 right-4 z-[500]", CONTROL_SURFACE, isFullscreen && FLY_TOP_RIGHT)}
          aria-label="Ver câmera no mapa"
        >
          <MapPin className="h-5 w-5 text-foreground" />
        </FloatingIconButton>
      )}

      {selectedCamera && status === "ready" && (
        <FloatingIconButton
          onClick={() => setIsFullscreen(true)}
          className={cn("absolute right-4 z-[500]", CONTROL_SURFACE, isFullscreen && FLY_BOTTOM_RIGHT)}
          style={{ bottom: "calc(var(--bottom-nav-clearance) + 2.5rem)" }}
          aria-label="Tela cheia em paisagem"
        >
          <Expand className="h-5 w-5 text-foreground" />
        </FloatingIconButton>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-[600] flex flex-col items-center justify-center gap-3 bg-background/90 px-8 text-center backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">Não foi possível carregar as câmeras</p>
          <Button variant="outline" onClick={fetchCameras}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      )}

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
