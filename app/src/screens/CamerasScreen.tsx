import { useCallback, useEffect, useState } from "react";
import { cameraClient } from "@/api";
import { CameraCard } from "@/components/cameras/CameraCard";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { Button } from "@/components/ui/button";
import type { Camera } from "@/types/camera";

type LoadState = "loading" | "loaded" | "error";

export function CamerasScreen() {
  const [state, setState] = useState<LoadState>("loading");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const load = useCallback(async () => {
    setState("loading");
    try {
      setCameras(await cameraClient.list());
      setState("loaded");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div
      className="flex h-full flex-col overflow-y-auto"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-lg font-semibold">Câmeras em Tempo Real</h1>
        <p className="text-sm text-muted-foreground">
          Feeds ao vivo de pontos estratégicos de Joinville.
        </p>
      </header>

      {state === "loading" && (
        <div className="flex flex-col gap-3 px-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-[74px] animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar a lista de câmeras.
          </p>
          <Button variant="outline" onClick={() => void load()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {state === "loaded" && (
        <ul className="flex flex-col gap-3 px-4">
          {cameras.map((camera) => (
            <li key={camera.id}>
              <CameraCard camera={camera} onSelect={setSelectedCamera} />
            </li>
          ))}
        </ul>
      )}

      {selectedCamera && (
        <CameraPlayer camera={selectedCamera} onClose={() => setSelectedCamera(null)} />
      )}
    </div>
  );
}
