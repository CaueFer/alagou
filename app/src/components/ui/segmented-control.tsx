import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onValueChange,
  disabled,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "flex rounded-md bg-muted p-1",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "flex-1 min-h-11 items-center justify-center rounded px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              selected ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}