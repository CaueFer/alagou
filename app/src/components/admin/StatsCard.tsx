import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export type StatsTone = "default" | "blue" | "amber" | "green" | "red" | "purple";

interface StatsCardProps {
  label: string;
  value: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: StatsTone;
  className?: string;
}

const TONE_CLASSES: Record<StatsTone, { container: string; icon: string }> = {
  default: { container: "bg-muted text-muted-foreground", icon: "text-muted-foreground" },
  blue: { container: "bg-blue-500/10 text-blue-600", icon: "text-blue-600" },
  amber: { container: "bg-amber-500/15 text-amber-600", icon: "text-amber-600" },
  green: { container: "bg-emerald-500/10 text-emerald-600", icon: "text-emerald-600" },
  red: { container: "bg-rose-500/10 text-rose-600", icon: "text-rose-600" },
  purple: { container: "bg-purple-500/10 text-purple-600", icon: "text-purple-600" },
};

export function StatsCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "default",
  className,
}: StatsCardProps) {
  const toneStyle = TONE_CLASSES[tone];

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-3 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
        {Icon ? (
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", toneStyle.container)}>
            <Icon className={cn("h-4 w-4", toneStyle.icon)} />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</span>
        {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
      </div>
    </div>
  );
}
