import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, RefreshCw } from "lucide-react";
import { cameraClient } from "@/api";
import { CameraList } from "@/components/cameras/CameraList";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { parseCameraName } from "@/lib/cameraName";
import { pickDefaultCamera, setLastSelectedCameraId } from "@/lib/cameraPreference";
import { cn } from "@/lib/utils";
import type { Camera } from "@/types/camera";

type CamerasStatus = "loading" | "ready" | "error";

export function CamerasScreen() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [status, setStatus] = useState<CamerasStatus>("loading");
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
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
  }

  function handleLocateOnMap() {
    if (!selectedCamera) {
      return;
    }
    navigate("/", { state: { focusLocation: { lat: selectedCamera.lat, lng: selectedCamera.lng } } });
  }

  const selectedLabel = selectedCamera ? parseCameraName(selectedCamera.name) : null;

  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div
        className={cn("bg-black", !isFullscreen && "sticky top-0 z-20")}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {!isOnline && (
          <div className="bg-offline-banner px-4 py-2 text-center text-sm font-medium text-offline-banner-foreground">
            Você está offline — câmeras indisponíveis
          </div>
        )}
        <CameraPlayer
          camera={selectedCamera}
          loading={status === "loading"}
          fullscreen={isFullscreen}
          autoLandscape={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          onExpand={() => setIsFullscreen(true)}
          onError={() => selectedCamera && markUnavailable(selectedCamera.id)}
        />
      </div>

      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        {selectedLabel ? (
          <>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{selectedLabel.region}</p>
              <h1 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-foreground">
                {selectedLabel.place}
              </h1>
            </div>
            <Button variant="secondary" className="h-11 shrink-0 rounded-full" onClick={handleLocateOnMap}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Ver no mapa
            </Button>
          </>
        ) : (
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-foreground">Câmeras</h1>
        )}
      </div>

      <section className="px-4 pt-6" style={{ paddingBottom: "var(--bottom-nav-clearance)" }}>
        <h2 className="text-xl font-bold tracking-[-0.01em] text-foreground">Todas as câmeras</h2>
        {cameras.length > 0 && (
          <p className="mt-0.5 text-sm text-muted-foreground">{cameras.length} pontos ao vivo em Joinville</p>
        )}

        <div className="mt-4">
          {status === "error" && cameras.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-base text-muted-foreground">Não foi possível carregar as câmeras</p>
              <Button variant="secondary" className="rounded-full" onClick={fetchCameras}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Tentar novamente
              </Button>
            </div>
          ) : (
            <CameraList
              cameras={cameras}
              locked={!isOnline}
              loading={status === "loading"}
              unavailableIds={unavailableIds}
              selectedCameraId={selectedCamera?.id ?? null}
              onSelect={handleSelectCamera}
            />
          )}
        </div>

        {cameras.length > 0 && (
          <p className="mt-6 text-xs text-muted-foreground">Imagens de satélite: Esri World Imagery</p>
        )}
      </section>
    </div>
  );
}
