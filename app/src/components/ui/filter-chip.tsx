import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  active: boolean;
  activeClassName?: string;
  indicatorClassName?: string;
}

function FilterChip({ active, activeClassName, indicatorClassName, className, children, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? cn("border-transparent bg-muted text-foreground", activeClassName)
          : "border-border bg-surface-container-lowest text-muted-foreground",
        className,
      )}
      {...props}
    >
      {indicatorClassName !== undefined && (
        <span
          aria-hidden="true"
          className={cn("h-2 w-2 rounded-full", active ? indicatorClassName : "bg-muted-foreground/40")}
        />
      )}
      {children}
    </button>
  );
}

export { FilterChip };
