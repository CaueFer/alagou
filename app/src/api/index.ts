import { mockAlertClient } from "@/api/mockAlertClient";
import type { AlertClient } from "@/api/alertClient";

export const alertClient: AlertClient = mockAlertClient;

export type { AlertClient } from "@/api/alertClient";
