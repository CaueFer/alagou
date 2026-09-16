import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}

export function SettingsSection({ title, icon, children, bodyClassName }: SettingsSectionProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
      <h2 className="flex items-center gap-2 px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </h2>
      <div className={cn("flex flex-col divide-y divide-border/60 px-4 pb-1", bodyClassName)}>{children}</div>
    </section>
  );
}
