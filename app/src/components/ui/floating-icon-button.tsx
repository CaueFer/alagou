import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const glassSurfaceClass =
  "border-outline-variant/40 bg-surface-container-lowest/70 shadow-lg backdrop-blur-md";

const floatingIconButtonVariants = cva(
  cn(
    "inline-flex items-center justify-center rounded-full border transition-colors hover:bg-surface-container-lowest/90",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    glassSurfaceClass,
  ),
  {
    variants: {
      size: {
        default: "h-11 w-11",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface FloatingIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatingIconButtonVariants> {}

const FloatingIconButton = React.forwardRef<HTMLButtonElement, FloatingIconButtonProps>(
  ({ className, size, type = "button", ...props }, ref) => (
    <button type={type} className={cn(floatingIconButtonVariants({ size, className }))} ref={ref} {...props} />
  ),
);
FloatingIconButton.displayName = "FloatingIconButton";

export { FloatingIconButton, floatingIconButtonVariants };
