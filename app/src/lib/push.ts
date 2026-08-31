import type { PushFlags, PushSubscriptionPayload } from "@/types/push";

export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalized);
  const output = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });
}

export async function unsubscribe(): Promise<void> {
  const existing = await getExistingSubscription();
  await existing?.unsubscribe();
}

export function toServerPayload(subscription: PushSubscription, flags: PushFlags): PushSubscriptionPayload | null {
  const keys = subscription.toJSON().keys;
  if (!keys?.p256dh || !keys?.auth) {
    return null;
  }
  return {
    endpoint: subscription.endpoint,
    keys: { p256dh: keys.p256dh, auth: keys.auth },
    ...flags,
  };
}
