import type { CivilDefenseClient } from "@/api/civilDefenseClient";
import { API_BASE_URL } from "@/lib/constants";
import type { CivilDefenseNotice } from "@/types/civilDefense";

export const httpCivilDefenseClient: CivilDefenseClient = {
  async listNotices() {
    const response = await fetch(`${API_BASE_URL}/api/civil-defense/notices`);
    if (!response.ok) {
      throw new Error(`GET /api/civil-defense/notices failed with status ${response.status}`);
    }
    return (await response.json()) as CivilDefenseNotice[];
  },
};
