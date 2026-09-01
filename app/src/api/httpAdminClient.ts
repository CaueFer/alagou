import { httpAuthClient } from "@/api/httpAuthClient";
import type { AdminClient, AlertQuery } from "@/api/adminClient";
import { API_BASE_URL } from "@/lib/constants";
import type { AdminOverview, ApiStatus, SchedulerStatus } from "@/types/admin";
import type { AlertType, Severity } from "@/types/alert";

interface ErrorResponse {
  error: string;
  detail: string;
}

async function parseError(response: Response): Promise<never> {
  const body = (await response.json().catch(() => null)) as ErrorResponse | null;
  if (response.status === 401) {
    throw new Error(body?.detail ?? "Você precisa entrar novamente.");
  }
  if (response.status === 403) {
    throw new Error(body?.detail ?? "Acesso restrito.");
  }
  throw new Error(body?.detail ?? "Não foi possível completar a operação.");
}

async function requestJson<T>(path: string): Promise<T> {
  const token = httpAuthClient.getSession()?.token;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    return parseError(response);
  }

  return (await response.json()) as T;
}

function toNumberRecord(record: Record<string, unknown> | undefined): Record<string, number> {
  if (!record) {
    return {};
  }
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, Number(value)]));
}

export const httpAdminClient: AdminClient = {
  async getOverview() {
    const data = await requestJson<AdminOverview & {
      alertsByType: Record<string, unknown>;
      alertsBySeverity: Record<string, unknown>;
    }>("/api/admin/overview");
    return {
      ...data,
      alertsByType: toNumberRecord(data.alertsByType),
      alertsBySeverity: toNumberRecord(data.alertsBySeverity),
    };
  },

  async listAlerts(query?: AlertQuery) {
    const params = new URLSearchParams();
    if (query?.active !== undefined) {
      params.set("active", String(query.active));
    }
    if (query?.type) {
      params.set("type", query.type);
    }
    if (query?.severity) {
      params.set("severity", query.severity);
    }
    if (query?.order) {
      params.set("order", query.order);
    }
    if (query?.limit) {
      params.set("limit", String(query.limit));
    }

    const data = await requestJson<Array<{
      id: number;
      type: AlertType;
      username: string;
      severity: Severity;
      active: boolean;
      lat: number;
      lng: number;
      photoUrls: string[];
      confirmationCount: number;
      clearReportCount: number;
      expirationDate: string;
      creationDate: string;
    }>>(`/api/admin/alerts${params.toString() ? `?${params.toString()}` : ""}`);

    return data.map((item) => ({
      id: String(item.id),
      type: item.type,
      username: item.username,
      severity: item.severity,
      active: item.active,
      location: { lat: item.lat, lng: item.lng },
      photoUrls: item.photoUrls,
      confirmationCount: item.confirmationCount,
      clearReportCount: item.clearReportCount,
      expirationDate: item.expirationDate,
      creationDate: item.creationDate,
    }));
  },

  async listSchedulers() {
    return requestJson<SchedulerStatus[]>("/api/admin/schedulers");
  },

  async getStatus() {
    return requestJson<ApiStatus>("/api/admin/status");
  },
};
