import { getAlertTypeInfo } from "@/lib/alertType";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { RecentAlert } from "@/types/recentAlert";

interface AlertFeedCardProps {
  alert: RecentAlert;
  onClick: () => void;
}

export function AlertFeedCard({ alert, onClick }: AlertFeedCardProps) {
  const info = getAlertTypeInfo(alert.type);
  const Icon = info.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-16 w-full items-center gap-3 rounded-lg bg-surface-container-lowest p-3 text-left",
        "shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]",
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", info.containerBgClass)}>
        <Icon className={cn("h-5 w-5", info.containerTextClass)} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className={cn("text-xs font-semibold uppercase tracking-[0.05em]", info.containerTextClass)}>
            {info.label}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(alert.emittedAt)}</span>
        </div>
        <p className="truncate text-sm font-semibold text-foreground">{alert.locationLabel}</p>
        <p className="truncate text-sm text-muted-foreground">{alert.summary}</p>
      </div>
    </button>
  );
}
