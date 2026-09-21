import type { AlertType, Severity } from "@/types/alert";
import type { AdminAlert, AdminOverview, AlertTimelinePoint, ApiStatus, SchedulerStatus } from "@/types/admin";

export interface AlertQuery {
  active?: boolean;
  type?: AlertType;
  severity?: Severity;
  order?: "recent" | "old";
  limit?: number;
}

export interface AdminClient {
  getOverview(): Promise<AdminOverview>;
  listAlerts(query?: AlertQuery): Promise<AdminAlert[]>;
  getAlertTimeline(days: number): Promise<AlertTimelinePoint[]>;
  listSchedulers(): Promise<SchedulerStatus[]>;
  getStatus(): Promise<ApiStatus>;
}
