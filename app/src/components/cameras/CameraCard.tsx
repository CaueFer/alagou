import { Camera as CameraIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Camera } from "@/types/camera";

interface CameraCardProps {
  camera: Camera;
  locked: boolean;
  onSelect: (camera: Camera) => void;
}

export function CameraCard({ camera, locked, onSelect }: CameraCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(camera)}
      disabled={locked}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-border bg-background p-3 text-left shadow-sm transition-opacity disabled:pointer-events-none",
        locked && "opacity-50",
      )}
    >
      <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        <CameraIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
        {!locked && (
          <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-live-indicator" />
            Ao vivo
          </span>
        )}
      </div>
      <span className="text-sm font-medium">{camera.name}</span>
    </button>
  );
}
