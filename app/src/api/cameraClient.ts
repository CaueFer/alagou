import type { Camera } from "@/types/camera";

export interface CameraClient {
  list(): Promise<Camera[]>;
}
