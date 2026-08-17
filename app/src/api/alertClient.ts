import type { Alert, ClearReportResult, NewAlertInput } from "@/types/alert";

export interface AlertClient {
  listActive(): Promise<Alert[]>;
  create(input: NewAlertInput): Promise<Alert>;
  confirm(id: string): Promise<Alert>;
  reportClear(id: string): Promise<ClearReportResult>;
}
