import { Badge } from "@/components/ui/badge";
import { getSchedulerStatusInfo } from "@/lib/schedulerStatus";
import type { SchedulerStatus } from "@/types/admin";

interface SchedulerStatusBadgeProps {
  status: SchedulerStatus["status"];
}

export function SchedulerStatusBadge({ status }: SchedulerStatusBadgeProps) {
  const info = getSchedulerStatusInfo(status);

  return (
    <Badge variant="outline" className={`inline-flex items-center gap-1.5 ${info.className}`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "OK"
            ? "bg-emerald-600 animate-pulse"
            : status === "FAILING"
            ? "bg-rose-600"
            : status === "LATE"
            ? "bg-amber-600"
            : "bg-muted-foreground"
        }`}
      />
      {info.label}
    </Badge>
  );
}
