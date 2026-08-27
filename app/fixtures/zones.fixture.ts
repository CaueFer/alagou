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
        [-48.86, -26.315],
        [-48.835, -26.315],
        [-48.835, -26.29],
        [-48.86, -26.29],
        [-48.86, -26.315],
      ],
    ],
    rivers: [
      {
        stationCode: "82274000",
        stationName: "Rio Cachoeira",
        level: null,
        status: "UNKNOWN",
        lastUpdate: "2026-08-27T12:00:00Z",
      },
    ],
    tide: {
      currentLevel: 1.42,
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
        [-48.865, -26.275],
        [-48.835, -26.275],
        [-48.835, -26.25],
        [-48.865, -26.25],
        [-48.865, -26.275],
      ],
    ],
    rivers: [
      {
        stationCode: "82272000",
        stationName: "Rio Itaum",
        level: null,
        status: "UNKNOWN",
        lastUpdate: "2026-08-27T10:30:00Z",
      },
    ],
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
        [-48.865, -26.35],
        [-48.83, -26.35],
        [-48.83, -26.32],
        [-48.865, -26.32],
        [-48.865, -26.35],
      ],
    ],
    rivers: [
      {
        stationCode: "82270000",
        stationName: "Rio Cachoeira",
        level: 2.84,
        status: "OVERFLOW",
        lastUpdate: "2026-08-27T12:00:00Z",
      },
    ],
    tide: {
      currentLevel: 1.85,
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
        [-48.805, -26.31],
        [-48.775, -26.31],
        [-48.775, -26.285],
        [-48.805, -26.285],
        [-48.805, -26.31],
      ],
    ],
    rivers: [
      {
        stationCode: "82266000",
        stationName: "Rio Piraí",
        level: 1.55,
        status: "ATTENTION",
        lastUpdate: "2026-08-27T11:00:00Z",
      },
    ],
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
        [-48.905, -26.31],
        [-48.87, -26.31],
        [-48.87, -26.285],
        [-48.905, -26.285],
        [-48.905, -26.31],
      ],
    ],
    rivers: [
      {
        stationCode: "82258000",
        stationName: "Rio Cubatão",
        level: 0.62,
        status: "NORMAL",
        lastUpdate: "2026-08-27T09:00:00Z",
      },
    ],
    tide: {
      currentLevel: 0.55,
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
        [-48.89, -26.18],
        [-48.85, -26.18],
        [-48.85, -26.15],
        [-48.89, -26.15],
        [-48.89, -26.18],
      ],
    ],
    rivers: [],
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
        [-48.85, -26.35],
        [-48.82, -26.35],
        [-48.82, -26.325],
        [-48.85, -26.325],
        [-48.85, -26.35],
      ],
    ],
    rivers: [
      {
        stationCode: "82264000",
        stationName: "Rio Velho",
        level: null,
        status: "UNKNOWN",
        lastUpdate: "2026-08-27T10:00:00Z",
      },
    ],
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
        [-48.91, -26.25],
        [-48.88, -26.25],
        [-48.88, -26.225],
        [-48.91, -26.225],
        [-48.91, -26.25],
      ],
    ],
    rivers: [
      {
        stationCode: "82256000",
        stationName: "Rio do Braço",
        level: null,
        status: "UNKNOWN",
        lastUpdate: "2026-08-27T09:30:00Z",
      },
    ],
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
