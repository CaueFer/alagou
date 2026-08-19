import { httpAlertClient } from "@/api/httpAlertClient";
import { httpAuthClient } from "@/api/httpAuthClient";
import { httpCameraClient } from "@/api/httpCameraClient";
import { httpCivilDefenseClient } from "@/api/httpCivilDefenseClient";
import type { AlertClient } from "@/api/alertClient";
import type { AuthClient } from "@/api/authClient";
import type { CameraClient } from "@/api/cameraClient";
import type { CivilDefenseClient } from "@/api/civilDefenseClient";

export const alertClient: AlertClient = httpAlertClient;
export const authClient: AuthClient = httpAuthClient;
export const cameraClient: CameraClient = httpCameraClient;
export const civilDefenseClient: CivilDefenseClient = httpCivilDefenseClient;

export type { AlertClient } from "@/api/alertClient";
export type { AuthClient } from "@/api/authClient";
export type { CameraClient } from "@/api/cameraClient";
export type { CivilDefenseClient } from "@/api/civilDefenseClient";
