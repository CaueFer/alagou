import type { RecentAlert } from "@/types/recentAlert";

export interface RecentAlertsClient {
  listRecent(): Promise<RecentAlert[]>;
}
