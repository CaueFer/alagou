import { useCallback } from "react";
import { pushClient } from "@/api";
import {
  getExistingSubscription,
  isPushSupported,
  subscribe,
  toServerPayload,
  unsubscribe,
} from "@/lib/push";
import type { PushFlags } from "@/types/push";

function hasGrantedPermission(): boolean {
  return "Notification" in window && window.Notification.permission === "granted";
}

export function usePushSubscription() {
  const syncEnabled = useCallback(async (flags: PushFlags) => {
    if (!isPushSupported() || !hasGrantedPermission()) {
      return;
    }
    const existing = await getExistingSubscription();
    const subscription = existing ?? (await subscribe(await pushClient.getVapidPublicKey()));
    if (!subscription) {
      return;
    }
    const payload = toServerPayload(subscription, flags);
    if (!payload) {
      return;
    }
    if (existing) {
      await pushClient.updateSubscription(payload);
    } else {
      await pushClient.upsertSubscription(payload);
    }
  }, []);

  const disableAll = useCallback(async () => {
    if (!isPushSupported()) {
      return;
    }
    const existing = await getExistingSubscription();
    if (existing) {
      await pushClient.deleteSubscription(existing.endpoint);
    }
    await unsubscribe();
  }, []);

  return { syncEnabled, disableAll } as const;
}
