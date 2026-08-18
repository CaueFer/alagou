import { httpCameraClient } from "@/api/httpCameraClient";
import { mockAlertClient } from "@/api/mockAlertClient";
import { mockAuthClient } from "@/api/mockAuthClient";
import type { AlertClient } from "@/api/alertClient";
import type { AuthClient } from "@/api/authClient";
import type { CameraClient } from "@/api/cameraClient";

export const alertClient: AlertClient = mockAlertClient;
export const authClient: AuthClient = mockAuthClient;
export const cameraClient: CameraClient = httpCameraClient;

export type { AlertClient } from "@/api/alertClient";
export type { AuthClient } from "@/api/authClient";
export type { CameraClient } from "@/api/cameraClient";
