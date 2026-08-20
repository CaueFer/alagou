import { CameraCard } from "@/components/cameras/CameraCard";
import type { Camera } from "@/types/camera";

const SKELETON_ROWS = 5;

interface CameraListProps {
  cameras: Camera[];
  locked: boolean;
  loading: boolean;
  unavailableIds: Set<string>;
  selectedCameraId: string | null;
  onSelect: (camera: Camera) => void;
}

export function CameraList({ cameras, locked, loading, unavailableIds, selectedCameraId, onSelect }: CameraListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <div key={index} className="h-[88px] animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {cameras.map((camera) => (
        <CameraCard
          key={camera.id}
          camera={camera}
          locked={locked}
          unavailable={unavailableIds.has(camera.id)}
          active={camera.id === selectedCameraId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
