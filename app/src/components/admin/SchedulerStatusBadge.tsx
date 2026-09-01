import { Badge } from "@/components/ui/badge";
import { getSchedulerStatusInfo } from "@/lib/schedulerStatus";
import type { SchedulerStatus } from "@/types/admin";

interface SchedulerStatusBadgeProps {
  status: SchedulerStatus["status"];
}

export function SchedulerStatusBadge({ status }: SchedulerStatusBadgeProps) {
  const info = getSchedulerStatusInfo(status);

  return (
    <Badge variant="outline" className={info.className}>
      {info.label}
    </Badge>
  );
}
