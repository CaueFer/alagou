import { CameraCard } from "@/components/cameras/CameraCard";
import { groupCamerasByRegion } from "@/lib/cameraName";
import type { Camera } from "@/types/camera";

const SKELETON_ROWS = 5;
const MAX_RISE_INDEX = 6;

interface CameraListProps {
  cameras: Camera[];
  locked: boolean;
  loading: boolean;
  unavailableIds: Set<string>;
  selectedCameraId: string | null;
  onSelect: (camera: Camera) => void;
}

export function CameraList({ cameras, locked, loading, unavailableIds, selectedCameraId, onSelect }: CameraListProps) {
  if (loading && cameras.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <div key={index} className="h-[88px] animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groupCamerasByRegion(cameras).map((group) => (
        <section key={group.region}>
          <h3 className="mb-2 text-base font-semibold text-muted-foreground">{group.region}</h3>
          <div className="flex flex-col gap-2">
            {group.cameras.map((camera) => (
              <div
                key={camera.id}
                className="rise-in"
                style={{ "--rise-index": Math.min(cameras.indexOf(camera), MAX_RISE_INDEX) } as React.CSSProperties}
              >
                <CameraCard
                  camera={camera}
                  locked={locked}
                  unavailable={unavailableIds.has(camera.id)}
                  active={camera.id === selectedCameraId}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
