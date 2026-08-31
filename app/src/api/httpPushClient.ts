import type { PushClient } from "@/api/pushClient";
import type { PushSubscriptionPayload } from "@/types/push";
import { API_BASE_URL } from "@/lib/constants";

interface ErrorResponse {
  error: string;
  detail: string;
}

async function parseError(response: Response): Promise<never> {
  const body = (await response.json().catch(() => null)) as ErrorResponse | null;
  throw new Error(body?.detail ?? "Não foi possível completar a operação.");
}

async function sendSubscription(method: "POST" | "PUT", payload: PushSubscriptionPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/push/subscriptions`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return parseError(response);
  }
}

export const httpPushClient: PushClient = {
  async getVapidPublicKey() {
    const response = await fetch(`${API_BASE_URL}/api/push/vapid-public-key`);
    if (!response.ok) {
      return parseError(response);
    }
    const data = (await response.json()) as { key: string };
    return data.key;
  },

  upsertSubscription(payload) {
    return sendSubscription("POST", payload);
  },

  updateSubscription(payload) {
    return sendSubscription("PUT", payload);
  },

  async deleteSubscription(endpoint) {
    const response = await fetch(`${API_BASE_URL}/api/push/subscriptions`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint }),
    });
    if (!response.ok) {
      return parseError(response);
    }
  },
};
