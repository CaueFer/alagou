import type { Camera } from "@/types/camera";

const REGION_SEPARATOR = ": ";
const FALLBACK_REGION = "Outros pontos";

export interface CameraLabel {
  region: string;
  place: string;
}

export interface CameraRegionGroup {
  region: string;
  cameras: Camera[];
}

export function parseCameraName(name: string): CameraLabel {
  const separatorIndex = name.indexOf(REGION_SEPARATOR);
  if (separatorIndex === -1) {
    return { region: FALLBACK_REGION, place: name };
  }
  return {
    region: name.slice(0, separatorIndex),
    place: name.slice(separatorIndex + REGION_SEPARATOR.length),
  };
}

export function groupCamerasByRegion(cameras: Camera[]): CameraRegionGroup[] {
  const groups = new Map<string, Camera[]>();
  for (const camera of cameras) {
    const { region } = parseCameraName(camera.name);
    groups.set(region, [...(groups.get(region) ?? []), camera]);
  }
  return Array.from(groups, ([region, regionCameras]) => ({ region, cameras: regionCameras }));
}
