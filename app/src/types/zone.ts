export type ZoneStatus = "NORMAL" | "ATTENTION" | "ALERT" | "CRITICAL" | "UNKNOWN";

export type RiverStatus = "NORMAL" | "ATTENTION" | "ALERT" | "UNKNOWN";

export type TideStatus = "HIGH_TIDE" | "LOW_TIDE" | "UNKNOWN";

export type RainStatus = "NORMAL" | "ATTENTION" | "ALERT" | "CRITICAL" | "UNKNOWN";

export interface ZoneRainWindow {
  measuredMm: number | null;
  forecastMm: number | null;
  averageMm: number | null;
}

export interface ZoneRain {
  lastHour: ZoneRainWindow | null;
  last24Hours: ZoneRainWindow | null;
  stationNames: string[];
  status: RainStatus;
  lastUpdate: string;
}

export interface ZoneRiver {
  dischargeCubicMetersPerSecond: number | null;
  forecastPeakCubicMetersPerSecond: number | null;
  status: RiverStatus;
  lastUpdate: string;
}

export interface ZoneTide {
  nearestExtremeHeightMeters: number | null;
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
  polygon: number[][][][];
  rain: ZoneRain | null;
  river: ZoneRiver | null;
  tide: ZoneTide | null;
  civilDefense: ZoneCivilDefense;
  overallStatus: ZoneStatus;
  lastUpdate: string;
}
