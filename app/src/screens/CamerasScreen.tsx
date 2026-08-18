import { useEffect, useState } from "react";
import { CameraList } from "@/components/cameras/CameraList";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { CAMERAS } from "@/lib/cameras";
import type { Camera } from "@/types/camera";

const INITIAL_LOAD_DELAY_MS = 400;

export function CamerasScreen() {
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), INITIAL_LOAD_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto" style={{ paddingBottom: "var(--bottom-nav-clearance)" }}>
      {!isOnline && (
        <div className="sticky top-0 z-10 bg-offline-banner px-4 py-2 text-center text-sm font-medium text-offline-banner-foreground">
          Você está offline — câmeras indisponíveis
        </div>
      )}

      <div className="px-4 pt-4">
        <h1 className="text-lg font-semibold">Câmeras em Tempo Real</h1>
        <p className="text-sm text-muted-foreground">Pontos estratégicos monitorados em Joinville</p>
      </div>

      <CameraList cameras={CAMERAS} locked={!isOnline} loading={loading} onSelect={setSelectedCamera} />

      <CameraPlayer camera={selectedCamera} open={selectedCamera !== null} onClose={() => setSelectedCamera(null)} />
    </div>
  );
}
