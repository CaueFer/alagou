import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  bodyClassName?: string;
}

export function SettingsSection({ title, children, bodyClassName }: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 border-b border-border/60 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <span aria-hidden="true" className="h-3 w-1 shrink-0 rounded-full bg-primary/40" />
        {title}
      </h2>
      <div className={cn("flex flex-col divide-y divide-border", bodyClassName)}>{children}</div>
    </section>
  );
}
