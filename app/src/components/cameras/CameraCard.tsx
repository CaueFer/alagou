import { Cctv } from "lucide-react";
import type { Camera } from "@/types/camera";

interface CameraCardProps {
  camera: Camera;
  onSelect: (camera: Camera) => void;
}

export function CameraCard({ camera, onSelect }: CameraCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(camera)}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors active:bg-muted"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Cctv className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{camera.name}</p>
        <p className="text-xs text-muted-foreground">Toque para assistir ao vivo</p>
      </div>
    </button>
  );
}
