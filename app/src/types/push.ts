export interface PushFlags {
  nearbyEnabled: boolean;
  climaticEnabled: boolean;
  civilDefenseEnabled: boolean;
}

export interface PushSubscriptionPayload extends PushFlags {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
