import type { SchedulerStatus } from "@/types/admin";

interface SchedulerStatusInfo {
  label: string;
  className: string;
}

const SCHEDULER_STATUS_INFO: Record<SchedulerStatus["status"], SchedulerStatusInfo> = {
  OK: {
    label: "OK",
    className: "bg-status-safe-container text-status-safe",
  },
  FAILING: {
    label: "Falhando",
    className: "bg-severity-critical-container text-severity-critical",
  },
  NEVER_RAN: {
    label: "Nunca rodou",
    className: "bg-muted text-muted-foreground",
  },
  LATE: {
    label: "Atrasado",
    className: "bg-severity-moderate-container text-severity-moderate",
  },
};

export function getSchedulerStatusInfo(status: SchedulerStatus["status"]): SchedulerStatusInfo {
  return SCHEDULER_STATUS_INFO[status];
}
