import { Skeleton } from "@/components/ui/skeleton";

interface CivilDefenseCardSkeletonProps {
  withThumbnail: boolean;
}

export function CivilDefenseCardSkeleton({ withThumbnail }: CivilDefenseCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="flex w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]"
    >
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      {withThumbnail && <Skeleton className="aspect-video w-full rounded-none" />}
    </div>
  );
}
