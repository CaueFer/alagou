import { useEffect } from "react";
import { presenceClient } from "@/api";
import { getDeviceId } from "@/lib/deviceIdentity";

const PING_INTERVAL_MS = 30_000;

export function usePresenceHeartbeat() {
  useEffect(() => {
    const deviceId = getDeviceId();
    let cancelled = false;

    const sendHeartbeat = async () => {
      if (cancelled) {
        return;
      }
      try {
        await presenceClient.sendHeartbeat(deviceId);
      } catch {
        return;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void sendHeartbeat();
      }
    };

    void sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, PING_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
}
