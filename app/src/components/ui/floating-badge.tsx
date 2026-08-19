import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const floatingBadgeVariants = cva(
  "pointer-events-none top-4 rounded-2xl border border-white/40 bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground shadow-lg backdrop-blur-md",
  {
    variants: {
      position: {
        absolute: "absolute left-1/2 z-[500] -translate-x-1/2",
        sticky: "sticky z-10 mx-auto w-fit",
      },
    },
    defaultVariants: {
      position: "absolute",
    },
  },
);

export interface FloatingBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof floatingBadgeVariants> {}

function FloatingBadge({ className, position, ...props }: FloatingBadgeProps) {
  return <div className={cn(floatingBadgeVariants({ position, className }))} {...props} />;
}

export { FloatingBadge };
