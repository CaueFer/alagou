import { Play, Camera as CameraIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Camera } from "@/types/camera";

interface CameraCardProps {
  camera: Camera;
  locked: boolean;
  unavailable: boolean;
  onSelect: (camera: Camera) => void;
}

export function CameraCard({ camera, locked, unavailable, onSelect }: CameraCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(camera)}
      disabled={locked || unavailable}
      className={cn(
        "flex w-full items-center gap-4 rounded-lg bg-surface-container-lowest p-4 text-left transition-all",
        "shadow-[0_1px_3px_0_rgba(11,28,48,0.08)] border border-outline-variant/50",
        "hover:shadow-[0_4px_12px_0_rgba(11,28,48,0.14)] hover:border-outline-variant",
        "disabled:pointer-events-none",
        locked && "opacity-50",
        unavailable && "opacity-60",
      )}
    >
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-container">
        {unavailable ? (
          <CameraIcon className="h-6 w-6 text-on-primary-container" strokeWidth={1.8} />
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
              <Play className="h-5 w-5 fill-primary text-primary ml-0.5" strokeWidth={2} />
            </div>
            {!locked && (
              <span className="absolute -right-1 -top-1 flex items-center gap-1 rounded-full bg-live-indicator px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-white shadow-sm">
                <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-semibold text-foreground truncate">{camera.name}</span>
        {unavailable ? (
          <span className="text-xs text-muted-foreground">Temporariamente indisponível</span>
        ) : (
          <span className="text-xs text-muted-foreground">Câmera ao vivo</span>
        )}
      </div>
    </button>
  );
}
