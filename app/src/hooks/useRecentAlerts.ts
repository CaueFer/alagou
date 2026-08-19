import { useCallback, useEffect, useState } from "react";
import { recentAlertsClient } from "@/api";
import type { RecentAlert } from "@/types/recentAlert";

const POLL_INTERVAL_MS = 30_000;

export type RecentAlertsStatus = "loading" | "ready" | "error";

export function useRecentAlerts() {
  const [alerts, setAlerts] = useState<RecentAlert[]>([]);
  const [status, setStatus] = useState<RecentAlertsStatus>("loading");

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await recentAlertsClient.listRecent();
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

  return {
    alerts,
    status,
    refetch: fetchAlerts,
  } as const;
}
