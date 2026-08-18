import type { Alert, ClearReportResult, NewAlertInput, Severity } from "@/types/alert";
import type { AlertClient } from "@/api/alertClient";
import { API_BASE_URL } from "@/lib/constants";
import { getDeviceUsername } from "@/lib/deviceIdentity";

const ANONYMOUS_USERNAME = "Anônimo";

interface AlertApiResponse {
  id: number;
  type: string;
  username: string;
  severity: Severity;
  lat: number;
  lng: number;
  photoUrls: string[];
  confirmationCount: number;
  clearReportCount: number;
  expirationDate: string;
  creationDate: string;
}

interface ClearReportApiResponse {
  id: number;
  alertId: number;
  username: string;
  createdAt: string;
  alertDeactivated: boolean;
}

interface ErrorResponse {
  error: string;
  detail: string;
}

function toAlert(data: AlertApiResponse): Alert {
  return {
    id: String(data.id),
    location: { lat: data.lat, lng: data.lng },
    severity: data.severity,
    username: data.username === ANONYMOUS_USERNAME ? null : data.username,
    confirmationCount: data.confirmationCount,
    clearReportCount: data.clearReportCount,
    createdAt: data.creationDate,
    expiresAt: data.expirationDate,
    photoUrls: data.photoUrls.map((path) => `${API_BASE_URL}${path}`),
  };
}

async function parseError(response: Response): Promise<never> {
  const body = (await response.json().catch(() => null)) as ErrorResponse | null;
  throw new Error(body?.detail ?? "Não foi possível completar a operação.");
}

async function fetchAlert(id: string): Promise<Alert> {
  const response = await fetch(`${API_BASE_URL}/api/alerts/${id}`);
  if (!response.ok) {
    return parseError(response);
  }
  return toAlert((await response.json()) as AlertApiResponse);
}

export const httpAlertClient: AlertClient = {
  async listActive() {
    const response = await fetch(`${API_BASE_URL}/api/alerts?expired=false&order=recent`);
    if (!response.ok) {
      return parseError(response);
    }
    const data = (await response.json()) as AlertApiResponse[];
    return data.map(toAlert);
  },

  async create(input: NewAlertInput) {
    const formData = new FormData();
    formData.append("type", "USER");
    formData.append("username", input.username?.trim() || ANONYMOUS_USERNAME);
    formData.append("severity", input.severity);
    formData.append("lat", String(input.location.lat));
    formData.append("lng", String(input.location.lng));
    for (const photo of input.photos) {
      formData.append("photos", photo);
    }

    const response = await fetch(`${API_BASE_URL}/api/alerts`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      return parseError(response);
    }
    return toAlert((await response.json()) as AlertApiResponse);
  },

  async confirm(id: string) {
    const username = getDeviceUsername();
    const response = await fetch(
      `${API_BASE_URL}/api/alerts/${id}/confirmations?username=${encodeURIComponent(username)}`,
      { method: "POST" },
    );
    if (!response.ok) {
      return parseError(response);
    }
    return fetchAlert(id);
  },

  async reportClear(id: string): Promise<ClearReportResult> {
    const username = getDeviceUsername();
    const response = await fetch(
      `${API_BASE_URL}/api/alerts/${id}/clear-reports?username=${encodeURIComponent(username)}`,
      { method: "POST" },
    );
    if (!response.ok) {
      return parseError(response);
    }
    const data = (await response.json()) as ClearReportApiResponse;
    if (data.alertDeactivated) {
      return { alert: null, removed: true };
    }
    return { alert: await fetchAlert(id), removed: false };
  },
};
