interface PagePlaceholderProps {
  title: string
  description: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2 px-6 pb-bottom-nav-height text-center">
      <h1 className="text-headline-lg-mobile text-on-background">{title}</h1>
      <p className="max-w-sm text-body-sm text-on-surface-variant">{description}</p>
    </div>
  )
}
