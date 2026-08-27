export type ZoneStatus = "NORMAL" | "ATTENTION" | "ALERT" | "CRITICAL" | "UNKNOWN";

export type RiverStatus = "NORMAL" | "ATTENTION" | "ALERT" | "OVERFLOW" | "UNKNOWN";

export type TideStatus = "HIGH_TIDE" | "LOW_TIDE" | "UNKNOWN";

export interface ZoneRiver {
  stationCode: string;
  stationName: string;
  level: number | null;
  status: RiverStatus;
  lastUpdate: string;
}

export interface ZoneTide {
  currentLevel: number | null;
  status: TideStatus;
  lastUpdate: string;
}

export interface ZoneCivilDefense {
  riskLevel: "NONE" | "ATTENTION" | "ALERT" | "EMERGENCY";
  recentAlerts: string[];
  lastUpdate: string;
}

export interface Zone {
  zoneId: string;
  zoneName: string;
  polygon: number[][][];
  rivers: ZoneRiver[];
  tide: ZoneTide | null;
  civilDefense: ZoneCivilDefense;
  overallStatus: ZoneStatus;
  lastUpdate: string;
}
