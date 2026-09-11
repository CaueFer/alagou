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
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest text-left shadow-[0_1px_3px_0_rgba(11,28,48,0.08)] transition-all duration-200 hover:border-outline-variant hover:shadow-[0_6px_16px_0_rgba(11,28,48,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex flex-col gap-1.5 p-3 pb-0">
        <div className="flex items-center justify-between gap-2">
          <RiskBadge level={notice.riskLevel} />
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            {formatRelativeTime(notice.publishedAt)}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <h3 className="text-sm font-semibold text-foreground">{notice.title}</h3>
      </div>
      {notice.thumbnailUrl && (
        <div className="mt-3 aspect-video w-full overflow-hidden">
          <img
            src={notice.thumbnailUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      )}
    </button>
  );
}
