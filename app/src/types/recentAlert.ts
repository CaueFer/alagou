import type { Alert } from "@/types/alert";
import type { CivilDefenseNotice } from "@/types/civilDefense";

export type RecentAlertType = "USER" | "CLIMATIC" | "CIVIL_DEFENSE";

export interface ClimaticRainWindow {
  measuredMm: number | null;
  forecastMm: number | null;
  averageMm: number | null;
}

export interface ClimaticRainReading {
  lastHour: ClimaticRainWindow | null;
  last24Hours: ClimaticRainWindow | null;
  stationNames: string[];
  status: string;
  lastUpdate: string;
}

export interface ClimaticRiverReading {
  dischargeCubicMetersPerSecond: number | null;
  forecastPeakCubicMetersPerSecond: number | null;
  status: string;
  lastUpdate: string;
}

export interface ClimaticTideReading {
  nearestExtremeHeightMeters: number | null;
  lastUpdate: string;
  status: string;
}

export interface ClimaticCivilDefenseStatus {
  alertLevel: number | null;
  recentAlerts: string[];
  lastUpdate: string;
}

export interface ClimaticZoneSnapshot {
  zoneId: string;
  zoneName: string;
  rain: ClimaticRainReading | null;
  river: ClimaticRiverReading | null;
  tide: ClimaticTideReading | null;
  civilDefense: ClimaticCivilDefenseStatus | null;
  lastUpdate: string;
}

export interface RecentAlert {
  id: string;
  type: RecentAlertType;
  summary: string;
  lat: number | null;
  lng: number | null;
  locationLabel: string;
  emittedAt: string;
  userAlert: Alert | null;
  civilDefenseNotice: CivilDefenseNotice | null;
  climaticZone: ClimaticZoneSnapshot | null;
}
