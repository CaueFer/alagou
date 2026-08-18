import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { cameraClient } from "@/api";
import { CameraList } from "@/components/cameras/CameraList";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import type { Camera } from "@/types/camera";

type CamerasStatus = "loading" | "ready" | "error";

export function CamerasScreen() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [status, setStatus] = useState<CamerasStatus>("loading");
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  const isOnline = useOnlineStatus();

  const fetchCameras = useCallback(async () => {
    try {
      setStatus("loading");
      const data = await cameraClient.list();
      setCameras(data);
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

  return (
    <div className="relative h-full w-full overflow-y-auto" style={{ paddingBottom: "var(--bottom-nav-clearance)" }}>
      {!isOnline && (
        <div className="sticky top-0 z-10 bg-offline-banner px-4 py-2 text-center text-sm font-medium text-offline-banner-foreground">
          Você está offline — câmeras indisponíveis
        </div>
      )}

      <div className="pointer-events-none sticky top-4 z-10 flex justify-center px-4">
        <div className="rounded-2xl border border-white/40 bg-white/70 px-4 py-2 text-center shadow-lg backdrop-blur-md">
          <h1 className="text-sm font-semibold text-foreground">Câmeras em Tempo Real</h1>
          <p className="text-xs text-muted-foreground">Pontos estratégicos monitorados em Joinville</p>
        </div>
      </div>

      <div className="px-4 pt-16">
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">Não foi possível carregar as câmeras</p>
            <Button variant="outline" onClick={fetchCameras}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {status !== "error" && (
          <CameraList
            cameras={cameras}
            locked={!isOnline}
            loading={status === "loading"}
            unavailableIds={unavailableIds}
            onSelect={setSelectedCamera}
          />
        )}
      </div>

      <CameraPlayer
        camera={selectedCamera}
        open={selectedCamera !== null}
        onClose={() => setSelectedCamera(null)}
        onError={() => selectedCamera && markUnavailable(selectedCamera.id)}
      />
    </div>
  );
}
