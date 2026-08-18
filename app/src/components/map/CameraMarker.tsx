import { useMemo } from "react";
import { Marker } from "react-leaflet";
import { createCameraIcon } from "@/components/map/cameraIcon";
import type { Camera } from "@/types/camera";

interface CameraMarkerProps {
  camera: Camera;
  onSelect?: (camera: Camera) => void;
}

export function CameraMarker({ camera, onSelect }: CameraMarkerProps) {
  const icon = useMemo(() => createCameraIcon(), []);

  return (
    <Marker
      position={[camera.lat, camera.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect?.(camera),
      }}
    />
  );
}
