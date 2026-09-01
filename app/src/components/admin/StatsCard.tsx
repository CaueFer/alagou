import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  description?: string;
  className?: string;
}

export function StatsCard({ label, value, description, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]", className)}>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
        <span className="text-[1.75rem] font-semibold leading-none text-foreground">{value}</span>
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </div>
    </div>
  );
}
