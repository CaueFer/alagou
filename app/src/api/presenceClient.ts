export interface HeartbeatResponse {
  activeUsers: number;
}

export interface PresenceClient {
  sendHeartbeat(deviceId: string): Promise<HeartbeatResponse>;
}
