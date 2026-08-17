interface PlaceholderScreenProps {
  title: string;
  description: string;
}

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 px-8 text-center"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="mt-4 text-xs text-muted-foreground">Em breve</p>
    </div>
  );
}
