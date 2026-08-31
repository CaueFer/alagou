import { useCallback, useEffect, useState } from "react";
import { adminClient } from "@/api";
import type { AdminAlert, AdminOverview, ApiStatus, SchedulerStatus } from "@/types/admin";
import type { AlertType, Severity } from "@/types/alert";

const POLL_INTERVAL_MS = 30_000;

export type AdminDataStatus = "loading" | "ready" | "error";

export function useAdminOverview(enabled = true) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [status, setStatus] = useState<AdminDataStatus>("loading");

  const fetchOverview = useCallback(async () => {
    try {
      const data = await adminClient.getOverview();
      setOverview(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchOverview();
    const interval = window.setInterval(fetchOverview, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [enabled, fetchOverview]);

  return { overview, status, refetch: fetchOverview } as const;
}

export interface AdminAlertFilters {
  active: boolean | null;
  type: AlertType | null;
  severity: Severity | null;
  order: "recent" | "old";
}

export function useAdminAlerts(filters: AdminAlertFilters, enabled = true) {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [status, setStatus] = useState<AdminDataStatus>("loading");

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await adminClient.listAlerts({
        active: filters.active ?? undefined,
        type: filters.type ?? undefined,
        severity: filters.severity ?? undefined,
        order: filters.order,
      });
      setAlerts(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [filters]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchAlerts();
  }, [enabled, fetchAlerts]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const interval = window.setInterval(fetchAlerts, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [enabled, fetchAlerts]);

  return { alerts, status, refetch: fetchAlerts } as const;
}

export function useSchedulerStatuses(enabled = true) {
  const [schedulers, setSchedulers] = useState<SchedulerStatus[]>([]);
  const [status, setStatus] = useState<AdminDataStatus>("loading");

  const fetchSchedulers = useCallback(async () => {
    try {
      const data = await adminClient.listSchedulers();
      setSchedulers(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchSchedulers();
    const interval = window.setInterval(fetchSchedulers, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [enabled, fetchSchedulers]);

  return { schedulers, status, refetch: fetchSchedulers } as const;
}

export function useApiStatus(enabled = true) {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [status, setStatus] = useState<AdminDataStatus>("loading");

  const fetchStatus = useCallback(async () => {
    try {
      const data = await adminClient.getStatus();
      setApiStatus(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchStatus();
    const interval = window.setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [enabled, fetchStatus]);

  return { apiStatus, status, refetch: fetchStatus } as const;
}
