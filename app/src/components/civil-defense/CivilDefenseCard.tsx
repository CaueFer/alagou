import { RiskBadge } from "@/components/civil-defense/RiskBadge";
import { formatRelativeTime } from "@/lib/time";
import type { CivilDefenseNotice } from "@/types/civilDefense";

interface CivilDefenseCardProps {
  notice: CivilDefenseNotice;
  onClick: () => void;
}

export function CivilDefenseCard({ notice, onClick }: CivilDefenseCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-16 w-full items-start gap-3 rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3 text-left shadow-[0_1px_3px_0_rgba(11,28,48,0.08)] transition-all hover:border-outline-variant hover:shadow-[0_4px_12px_0_rgba(11,28,48,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="shrink-0 pt-0.5">
        <RiskBadge level={notice.riskLevel} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{notice.title}</h3>
          <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(notice.publishedAt)}</span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{notice.excerpt}</p>
      </div>
    </button>
  );
}
