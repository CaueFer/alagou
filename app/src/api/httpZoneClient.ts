import type { ZoneClient } from "@/api/zoneClient";
import { API_BASE_URL } from "@/lib/constants";
import type { Zone } from "@/types/zone";

export const httpZoneClient: ZoneClient = {
  async list() {
    const response = await fetch(`${API_BASE_URL}/api/zones`);
    if (!response.ok) {
      throw new Error(`GET /api/zones failed with status ${response.status}`);
    }
    return (await response.json()) as Zone[];
  },
};
