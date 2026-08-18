import type { Alert, ClearReportResult, NewAlertInput } from "@/types/alert";
import type { AlertClient } from "@/api/alertClient";

const ALERT_TTL_MS = 45 * 60_000;
const CLEAR_REPORTS_TO_REMOVE = 3;
const SIMULATED_LATENCY_MS = 400;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

let store: Alert[] = [
  {
    id: "seed-1",
    location: { lat: -26.3044, lng: -48.8456 },
    severity: "CRITICAL",
    username: "Marcos",
    confirmationCount: 6,
    clearReportCount: 0,
    createdAt: minutesFromNow(-20),
    expiresAt: minutesFromNow(25),
    photoUrls: [],
  },
  {
    id: "seed-2",
    location: { lat: -26.298, lng: -48.851 },
    severity: "SEVERE",
    username: null,
    confirmationCount: 2,
    clearReportCount: 1,
    createdAt: minutesFromNow(-10),
    expiresAt: minutesFromNow(35),
    photoUrls: [],
  },
  {
    id: "seed-3",
    location: { lat: -26.309, lng: -48.84 },
    severity: "MODERATE",
    username: "Julia",
    confirmationCount: 0,
    clearReportCount: 0,
    createdAt: minutesFromNow(-40),
    expiresAt: minutesFromNow(5),
    photoUrls: [],
  },
  {
    id: "seed-4",
    location: { lat: -26.294, lng: -48.837 },
    severity: "SEVERE",
    username: "Pedro",
    confirmationCount: 4,
    clearReportCount: 0,
    createdAt: minutesFromNow(-5),
    expiresAt: minutesFromNow(40),
    photoUrls: [],
  },
];

function generateId(): string {
  return `alert-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export const mockAlertClient: AlertClient = {
  async listActive() {
    await delay(SIMULATED_LATENCY_MS);
    const now = Date.now();
    return store.filter((alert) => new Date(alert.expiresAt).getTime() > now);
  },

  async create(input: NewAlertInput) {
    await delay(SIMULATED_LATENCY_MS);
    const alert: Alert = {
      id: generateId(),
      location: input.location,
      severity: input.severity,
      username: input.username,
      confirmationCount: 0,
      clearReportCount: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ALERT_TTL_MS).toISOString(),
      photoUrls: input.photos.map((photo) => URL.createObjectURL(photo)),
    };
    store = [...store, alert];
    return alert;
  },

  async confirm(id: string) {
    await delay(SIMULATED_LATENCY_MS);
    const alert = store.find((item) => item.id === id);
    if (!alert) {
      throw new Error("Alerta não encontrado");
    }
    alert.confirmationCount += 1;
    alert.expiresAt = new Date(Date.now() + ALERT_TTL_MS).toISOString();
    return alert;
  },

  async reportClear(id: string): Promise<ClearReportResult> {
    await delay(SIMULATED_LATENCY_MS);
    const alert = store.find((item) => item.id === id);
    if (!alert) {
      throw new Error("Alerta não encontrado");
    }
    alert.clearReportCount += 1;
    if (alert.clearReportCount >= CLEAR_REPORTS_TO_REMOVE) {
      store = store.filter((item) => item.id !== id);
      return { alert: null, removed: true };
    }
    return { alert, removed: false };
  },
};
