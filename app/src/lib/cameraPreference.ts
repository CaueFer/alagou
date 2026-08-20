import type { Camera } from "@/types/camera";

const LAST_CAMERA_STORAGE_KEY = "alagou.camera.lastSelectedId";
const DEFAULT_CAMERA_ID = "centro-terminal-central";

export function getLastSelectedCameraId(): string | null {
  return localStorage.getItem(LAST_CAMERA_STORAGE_KEY);
}

export function setLastSelectedCameraId(id: string): void {
  localStorage.setItem(LAST_CAMERA_STORAGE_KEY, id);
}

export function pickDefaultCamera(cameras: Camera[]): Camera | null {
  if (cameras.length === 0) {
    return null;
  }

  const lastSelectedId = getLastSelectedCameraId();
  const lastSelected = lastSelectedId ? cameras.find((camera) => camera.id === lastSelectedId) : undefined;
  if (lastSelected) {
    return lastSelected;
  }

  const defaultCamera = cameras.find((camera) => camera.id === DEFAULT_CAMERA_ID);
  return defaultCamera ?? cameras[0];
}
