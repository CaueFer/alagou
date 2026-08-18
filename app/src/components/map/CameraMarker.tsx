import { useMemo } from "react";
import { Marker } from "react-leaflet";
import { createCameraIcon } from "@/components/map/cameraIcon";
import type { Camera } from "@/types/camera";

interface CameraMarkerProps {
  camera: Camera;
}

export function CameraMarker({ camera }: CameraMarkerProps) {
  const icon = useMemo(() => createCameraIcon(), []);

  return (
    <Marker
      position={[camera.lat, camera.lng]}
      icon={icon}
    />
  );
}
