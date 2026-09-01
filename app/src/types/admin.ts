import type { AlertLocation, AlertType, Severity } from "@/types/alert";

export interface AdminOverview {
  totalUsers: number;
  googleAccounts: number;
  passwordAccounts: number;
  activeUsers: number;
  totalAlerts: number;
  activeAlerts: number;
  expiredAlerts: number;
  alertsByType: Record<string, number>;
  alertsBySeverity: Record<string, number>;
  totalConfirmations: number;
  totalClearReports: number;
  totalCivilDefenseNotices: number;
}

export interface AdminAlert {
  id: string;
  type: AlertType;
  username: string;
  severity: Severity;
  active: boolean;
  location: AlertLocation;
  photoUrls: string[];
  confirmationCount: number;
  clearReportCount: number;
  expirationDate: string;
  creationDate: string;
}

export interface SchedulerStatus {
  id: string;
  name: string;
  description: string;
  interval: string;
  lastRunAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastErrorMessage: string | null;
  lastDurationMs: number;
  runCount: number;
  failureCount: number;
  nextExpectedRunAt: string | null;
  status: "OK" | "FAILING" | "NEVER_RAN" | "LATE";
}

export interface ApiStatus {
  status: "UP" | "DOWN";
  database: "UP" | "DOWN";
  startedAt: string;
  uptimeSeconds: number;
  timestamp: string;
  version: string;
}
