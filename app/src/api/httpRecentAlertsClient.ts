import type { RecentAlertsClient } from "@/api/recentAlertsClient";
import { toAlert, type AlertApiResponse } from "@/api/httpAlertClient";
import { API_BASE_URL } from "@/lib/constants";
import type { CivilDefenseNotice } from "@/types/civilDefense";
import type { ClimaticZoneSnapshot, RecentAlert, RecentAlertType } from "@/types/recentAlert";

interface RecentAlertApiResponse {
  id: string;
  type: RecentAlertType;
  summary: string;
  lat: number | null;
  lng: number | null;
  locationLabel: string;
  emittedAt: string;
  userAlert: AlertApiResponse | null;
  civilDefenseNotice: CivilDefenseNotice | null;
  climaticZone: ClimaticZoneSnapshot | null;
}

function toRecentAlert(data: RecentAlertApiResponse): RecentAlert {
  return {
    id: data.id,
    type: data.type,
    summary: data.summary,
    lat: data.lat,
    lng: data.lng,
    locationLabel: data.locationLabel,
    emittedAt: data.emittedAt,
    userAlert: data.userAlert ? toAlert(data.userAlert) : null,
    civilDefenseNotice: data.civilDefenseNotice,
    climaticZone: data.climaticZone,
  };
}

export const httpRecentAlertsClient: RecentAlertsClient = {
  async listRecent() {
    const response = await fetch(`${API_BASE_URL}/api/recent-alerts`);
    if (!response.ok) {
      throw new Error(`GET /api/recent-alerts failed with status ${response.status}`);
    }
    const data = (await response.json()) as RecentAlertApiResponse[];
    return data.map(toRecentAlert);
  },
};
