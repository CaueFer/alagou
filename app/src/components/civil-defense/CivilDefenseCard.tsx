import { ExternalLink } from "lucide-react";
import { RiskBadge } from "@/components/civil-defense/RiskBadge";
import { formatRelativeTime } from "@/lib/time";
import type { CivilDefenseNotice } from "@/types/civilDefense";

interface CivilDefenseCardProps {
  notice: CivilDefenseNotice;
}

export function CivilDefenseCard({ notice }: CivilDefenseCardProps) {
  return (
    <a
      href={notice.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest text-left shadow-[0_1px_3px_0_rgba(11,28,48,0.08)] hover:border-outline-variant hover:shadow-[0_6px_16px_0_rgba(11,28,48,0.14)] transition-all duration-200 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {notice.thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={notice.thumbnailUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <RiskBadge level={notice.riskLevel} />
          <span className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
            {formatRelativeTime(notice.publishedAt)}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <h2 className="text-lg font-medium leading-snug text-foreground">{notice.title}</h2>
      </div>
    </a>
  );
}
