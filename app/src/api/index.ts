import { httpAlertClient } from "@/api/httpAlertClient";
import { httpAuthClient } from "@/api/httpAuthClient";
import type { AlertClient } from "@/api/alertClient";
import type { AuthClient } from "@/api/authClient";

export const alertClient: AlertClient = httpAlertClient;
export const authClient: AuthClient = httpAuthClient;

export type { AlertClient } from "@/api/alertClient";
export type { AuthClient } from "@/api/authClient";
