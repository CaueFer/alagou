import { ExternalLink } from "lucide-react";
import { RiskBadge } from "@/components/civil-defense/RiskBadge";
import { formatRelativeTime } from "@/lib/time";
import type { CivilDefenseNotice } from "@/types/civilDefense";

interface CivilDefenseCardProps {
  notice: CivilDefenseNotice;
}

export function CivilDefenseCard({ notice }: CivilDefenseCardProps) {
  function handleClick() {
    window.open(notice.link, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex min-h-16 w-full items-center gap-3 rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3 text-left shadow-[0_1px_3px_0_rgba(11,28,48,0.08)] transition-all hover:border-outline-variant hover:shadow-[0_4px_12px_0_rgba(11,28,48,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {notice.thumbnailUrl && (
        <img
          src={notice.thumbnailUrl}
          alt=""
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-md border border-outline-variant/50 object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <RiskBadge level={notice.riskLevel} />
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            {formatRelativeTime(notice.publishedAt)}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-1.5 text-sm font-semibold text-foreground">{notice.title}</h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{notice.excerpt}</p>
      </div>
    </button>
  );
}
