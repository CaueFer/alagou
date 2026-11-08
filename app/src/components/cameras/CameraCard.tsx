import { CameraMapThumbnail } from "@/components/cameras/CameraMapThumbnail";
import { parseCameraName } from "@/lib/cameraName";
import { cn } from "@/lib/utils";
import type { Camera } from "@/types/camera";

interface CameraCardProps {
  camera: Camera;
  locked: boolean;
  unavailable: boolean;
  active: boolean;
  onSelect: (camera: Camera) => void;
}

function CameraCardStatus({ locked, unavailable, active }: Pick<CameraCardProps, "locked" | "unavailable" | "active">) {
  if (unavailable) {
    return <span className="text-sm text-muted-foreground">Temporariamente indisponível</span>;
  }
  if (locked) {
    return <span className="text-sm text-muted-foreground">Sem conexão</span>;
  }
  if (active) {
    return <span className="text-sm font-medium text-foreground">Assistindo agora</span>;
  }
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="h-2 w-2 rounded-full bg-live-indicator" aria-hidden="true" />
      Ao vivo
    </span>
  );
}

export function CameraCard({ camera, locked, unavailable, active, onSelect }: CameraCardProps) {
  const { place } = parseCameraName(camera.name);

  return (
    <button
      type="button"
      onClick={() => onSelect(camera)}
      disabled={locked || unavailable}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-2 text-left transition-all",
        "shadow-[0_1px_3px_0_rgba(11,28,48,0.08)] hover:border-outline-variant hover:shadow-[0_4px_12px_0_rgba(11,28,48,0.14)] active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none",
        locked && "opacity-50",
        unavailable && "opacity-60",
        active && "border-primary ring-1 ring-primary",
      )}
    >
      <CameraMapThumbnail lat={camera.lat} lng={camera.lng} active={active} dimmed={unavailable} />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-base font-semibold leading-snug text-foreground">{place}</span>
        <CameraCardStatus locked={locked} unavailable={unavailable} active={active} />
      </span>
    </button>
  );
}
