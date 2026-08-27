import { useEffect, useState } from "react";
import { zoneClient } from "@/api";
import type { Zone } from "@/types/zone";

export type ZonesStatus = "idle" | "loading" | "ready" | "error";

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [status, setStatus] = useState<ZonesStatus>("idle");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    zoneClient
      .list()
      .then((data) => {
        if (!cancelled) {
          setZones(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { zones, status } as const;
}
