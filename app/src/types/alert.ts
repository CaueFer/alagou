export type Severity = "MODERATE" | "SEVERE" | "CRITICAL";

export interface AlertLocation {
  lat: number;
  lng: number;
}

export interface Alert {
  id: string;
  location: AlertLocation;
  severity: Severity;
  username: string | null;
  confirmationCount: number;
  clearReportCount: number;
  createdAt: string;
  expiresAt: string;
  photoUrls: string[];
}

export interface NewAlertInput {
  location: AlertLocation;
  severity: Severity;
  username: string | null;
  photos: File[];
}

export interface ClearReportResult {
  alert: Alert | null;
  removed: boolean;
}
