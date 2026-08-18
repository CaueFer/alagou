import type { CameraClient } from "@/api/cameraClient";
import { API_BASE_URL } from "@/lib/constants";
import type { Camera } from "@/types/camera";

export const httpCameraClient: CameraClient = {
  async list() {
    const response = await fetch(`${API_BASE_URL}/api/cameras`);
    if (!response.ok) {
      throw new Error(`GET /api/cameras failed with status ${response.status}`);
    }
    return (await response.json()) as Camera[];
  },
};
