import type { Alert } from "@/types/alert";
import type { CivilDefenseNotice } from "@/types/civilDefense";

export type RecentAlertType = "USER" | "CLIMATIC" | "CIVIL_DEFENSE";

export interface ClimaticRiverReading {
  stationCode: string;
  stationName: string;
  level: number | null;
  lastUpdate: string;
}

export interface ClimaticTideReading {
  currentLevel: number | null;
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
  rivers: ClimaticRiverReading[];
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
