import { Skeleton } from "@/components/ui/skeleton";

interface CivilDefenseCardSkeletonProps {
  withThumbnail: boolean;
}

export function CivilDefenseCardSkeleton({ withThumbnail }: CivilDefenseCardSkeletonProps) {
  return (
    <div aria-hidden="true" className="flex w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
      {withThumbnail && <Skeleton className="aspect-video w-full rounded-none" />}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/5" />
      </div>
    </div>
  );
}
