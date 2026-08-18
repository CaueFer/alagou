import { useCallback, useEffect, useState } from "react";
import { alertClient } from "@/api";
import type { Alert } from "@/types/alert";

const POLL_INTERVAL_MS = 30_000;

export type AlertsStatus = "loading" | "ready" | "error";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<AlertsStatus>("loading");

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await alertClient.listActive();
      setAlerts(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const updateAlert = useCallback((updated: Alert) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === updated.id ? updated : alert)));
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [...prev, alert]);
  }, []);

  return {
    alerts,
    status,
    refetch: fetchAlerts,
    updateAlert,
    removeAlert,
    addAlert,
  } as const;
}
