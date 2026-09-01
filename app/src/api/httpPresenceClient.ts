import { API_BASE_URL } from "@/lib/constants";
import type { HeartbeatResponse, PresenceClient } from "@/api/presenceClient";

interface ErrorResponse {
  error: string;
  detail: string;
}

async function parseError(response: Response): Promise<never> {
  const body = (await response.json().catch(() => null)) as ErrorResponse | null;
  throw new Error(body?.detail ?? "Não foi possível completar a operação.");
}

export const httpPresenceClient: PresenceClient = {
  async sendHeartbeat(deviceId: string) {
    const response = await fetch(`${API_BASE_URL}/api/presence/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      return parseError(response);
    }

    return (await response.json()) as HeartbeatResponse;
  },
};
