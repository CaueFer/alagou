// Development-only fixture for GET /api/zones. Not imported by app code.
// To develop without the backend, point src/api/index.ts's zoneClient at
// fixtureZoneClient and run the app; revert before delivering.
import type { ZoneClient } from "../src/api/zoneClient";
import type { Zone } from "../src/types/zone";

export const ZONES_FIXTURE: Zone[] = [
  {
    zoneId: "centro",
    zoneName: "Centro",
    polygon: [
      [
        [
          [-48.86, -26.315],
          [-48.835, -26.315],
          [-48.835, -26.29],
          [-48.86, -26.29],
          [-48.86, -26.315],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: 9.0, forecastMm: 11.0, averageMm: 10.0 },
      last24Hours: { measuredMm: 70.0, forecastMm: 90.0, averageMm: 80.0 },
      stationNames: ["Centro"],
      status: "ALERT",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: 1.1,
      forecastPeakCubicMetersPerSecond: 3.4,
      status: "ALERT",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: {
      nearestExtremeHeightMeters: 1.42,
      status: "HIGH_TIDE",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    civilDefense: {
      riskLevel: "ALERT",
      recentAlerts: ["Defesa Civil alerta para risco de alagamentos no Centro."],
      lastUpdate: "2026-08-27T11:00:00Z",
    },
    overallStatus: "ALERT",
    lastUpdate: "2026-08-27T12:00:00Z",
  },
  {
    zoneId: "norte",
    zoneName: "Norte",
    polygon: [
      [
        [
          [-48.865, -26.275],
          [-48.845, -26.275],
          [-48.845, -26.255],
          [-48.865, -26.255],
          [-48.865, -26.275],
        ],
      ],
      [
        [
          [-48.84, -26.27],
          [-48.825, -26.27],
          [-48.825, -26.25],
          [-48.84, -26.25],
          [-48.84, -26.27],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: null, forecastMm: null, averageMm: null },
      last24Hours: { measuredMm: null, forecastMm: null, averageMm: null },
      stationNames: [],
      status: "UNKNOWN",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: null,
      forecastPeakCubicMetersPerSecond: null,
      status: "UNKNOWN",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: null,
    civilDefense: {
      riskLevel: "NONE",
      recentAlerts: [],
      lastUpdate: "2026-08-27T10:30:00Z",
    },
    overallStatus: "UNKNOWN",
    lastUpdate: "2026-08-27T10:30:00Z",
  },
  {
    zoneId: "sul",
    zoneName: "Sul",
    polygon: [
      [
        [
          [-48.865, -26.35],
          [-48.83, -26.35],
          [-48.83, -26.32],
          [-48.865, -26.32],
          [-48.865, -26.35],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: 18.0, forecastMm: 22.0, averageMm: 20.0 },
      last24Hours: { measuredMm: 95.0, forecastMm: 105.0, averageMm: 100.0 },
      stationNames: ["Centro"],
      status: "CRITICAL",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: 1.2,
      forecastPeakCubicMetersPerSecond: 4.4,
      status: "ALERT",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: {
      nearestExtremeHeightMeters: 1.85,
      status: "HIGH_TIDE",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    civilDefense: {
      riskLevel: "EMERGENCY",
      recentAlerts: ["Defesa Civil emite alerta de emergência por risco de transbordamento no Sul."],
      lastUpdate: "2026-08-27T11:30:00Z",
    },
    overallStatus: "CRITICAL",
    lastUpdate: "2026-08-27T12:00:00Z",
  },
  {
    zoneId: "leste",
    zoneName: "Leste",
    polygon: [
      [
        [
          [-48.805, -26.31],
          [-48.775, -26.31],
          [-48.775, -26.285],
          [-48.805, -26.285],
          [-48.805, -26.31],
        ],
        [
          [-48.795, -26.302],
          [-48.785, -26.302],
          [-48.785, -26.293],
          [-48.795, -26.293],
          [-48.795, -26.302],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: 5.0, forecastMm: 7.0, averageMm: 6.0 },
      last24Hours: { measuredMm: 45.0, forecastMm: 55.0, averageMm: 50.0 },
      stationNames: ["Centro"],
      status: "ATTENTION",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: 0.9,
      forecastPeakCubicMetersPerSecond: 2.1,
      status: "ATTENTION",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: null,
    civilDefense: {
      riskLevel: "ATTENTION",
      recentAlerts: ["Defesa Civil recomenda atenção para elevação do Rio Piraí no Leste."],
      lastUpdate: "2026-08-27T11:00:00Z",
    },
    overallStatus: "ATTENTION",
    lastUpdate: "2026-08-27T11:00:00Z",
  },
  {
    zoneId: "oeste",
    zoneName: "Oeste",
    polygon: [
      [
        [
          [-48.905, -26.31],
          [-48.87, -26.31],
          [-48.87, -26.285],
          [-48.905, -26.285],
          [-48.905, -26.31],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: 0.2, forecastMm: 0.0, averageMm: 0.1 },
      last24Hours: { measuredMm: 3.0, forecastMm: 1.0, averageMm: 2.0 },
      stationNames: ["Centro"],
      status: "NORMAL",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: 0.5,
      forecastPeakCubicMetersPerSecond: 0.6,
      status: "NORMAL",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: {
      nearestExtremeHeightMeters: 0.55,
      status: "LOW_TIDE",
      lastUpdate: "2026-08-27T09:00:00Z",
    },
    civilDefense: {
      riskLevel: "NONE",
      recentAlerts: [],
      lastUpdate: "2026-08-27T09:00:00Z",
    },
    overallStatus: "NORMAL",
    lastUpdate: "2026-08-27T09:00:00Z",
  },
  {
    zoneId: "pirabeiraba",
    zoneName: "Pirabeiraba",
    polygon: [
      [
        [
          [-48.89, -26.18],
          [-48.85, -26.18],
          [-48.85, -26.15],
          [-48.89, -26.15],
          [-48.89, -26.18],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: null, forecastMm: null, averageMm: null },
      last24Hours: { measuredMm: null, forecastMm: null, averageMm: null },
      stationNames: [],
      status: "UNKNOWN",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: null,
      forecastPeakCubicMetersPerSecond: null,
      status: "UNKNOWN",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: null,
    civilDefense: {
      riskLevel: "NONE",
      recentAlerts: [],
      lastUpdate: "2026-08-27T08:00:00Z",
    },
    overallStatus: "UNKNOWN",
    lastUpdate: "2026-08-27T08:00:00Z",
  },
  {
    zoneId: "distrito-industrial",
    zoneName: "Distrito Industrial",
    polygon: [
      [
        [
          [-48.85, -26.35],
          [-48.825, -26.35],
          [-48.825, -26.325],
          [-48.85, -26.325],
          [-48.85, -26.35],
        ],
      ],
      [
        [
          [-48.845, -26.31],
          [-48.82, -26.31],
          [-48.82, -26.29],
          [-48.845, -26.29],
          [-48.845, -26.31],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: 5.0, forecastMm: 7.0, averageMm: 6.0 },
      last24Hours: { measuredMm: 45.0, forecastMm: 55.0, averageMm: 50.0 },
      stationNames: ["Centro"],
      status: "ATTENTION",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: 0.9,
      forecastPeakCubicMetersPerSecond: 2.1,
      status: "ATTENTION",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: null,
    civilDefense: {
      riskLevel: "ATTENTION",
      recentAlerts: ["Defesa Civil acompanha pontos de alagamento no Distrito Industrial."],
      lastUpdate: "2026-08-27T10:00:00Z",
    },
    overallStatus: "ATTENTION",
    lastUpdate: "2026-08-27T10:00:00Z",
  },
  {
    zoneId: "vila-nova",
    zoneName: "Vila Nova",
    polygon: [
      [
        [
          [-48.91, -26.25],
          [-48.88, -26.25],
          [-48.88, -26.225],
          [-48.91, -26.225],
          [-48.91, -26.25],
        ],
      ],
    ],
    rain: {
      lastHour: { measuredMm: null, forecastMm: null, averageMm: null },
      last24Hours: { measuredMm: null, forecastMm: null, averageMm: null },
      stationNames: [],
      status: "UNKNOWN",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    river: {
      dischargeCubicMetersPerSecond: null,
      forecastPeakCubicMetersPerSecond: null,
      status: "UNKNOWN",
      lastUpdate: "2026-08-27T12:00:00Z",
    },
    tide: null,
    civilDefense: {
      riskLevel: "NONE",
      recentAlerts: [],
      lastUpdate: "2026-08-27T09:30:00Z",
    },
    overallStatus: "UNKNOWN",
    lastUpdate: "2026-08-27T09:30:00Z",
  },
];

export const fixtureZoneClient: ZoneClient = {
  async list() {
    return ZONES_FIXTURE;
  },
};
