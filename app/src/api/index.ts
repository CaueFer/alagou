import { mockAlertClient } from "@/api/mockAlertClient";
import { mockAuthClient } from "@/api/mockAuthClient";
import type { AlertClient } from "@/api/alertClient";
import type { AuthClient } from "@/api/authClient";

export const alertClient: AlertClient = mockAlertClient;
export const authClient: AuthClient = mockAuthClient;

export type { AlertClient } from "@/api/alertClient";
export type { AuthClient } from "@/api/authClient";
