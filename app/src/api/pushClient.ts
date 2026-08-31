import type { PushSubscriptionPayload } from "@/types/push";

export interface PushClient {
  getVapidPublicKey(): Promise<string>;
  upsertSubscription(payload: PushSubscriptionPayload): Promise<void>;
  updateSubscription(payload: PushSubscriptionPayload): Promise<void>;
  deleteSubscription(endpoint: string): Promise<void>;
}
