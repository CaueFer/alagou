import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function ScreenHeader({ title, description, className }: ScreenHeaderProps) {
  return (
    <header className={cn("px-4 pb-2", className)} style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.75rem)" }}>
      <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
        {title}
      </h1>
      {description && <p className="mt-1 text-base text-muted-foreground">{description}</p>}
    </header>
  );
}
