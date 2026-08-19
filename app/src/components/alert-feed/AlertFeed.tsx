import { ShieldCheck } from "lucide-react";
import { AlertFeedCard } from "@/components/alert-feed/AlertFeedCard";
import type { RecentAlert, RecentAlertType } from "@/types/recentAlert";

const SKELETON_ROWS = 3;

interface AlertFeedProps {
  alerts: RecentAlert[];
  loading: boolean;
  selectedTypes: ReadonlySet<RecentAlertType>;
  onSelect: (alert: RecentAlert) => void;
}

export function AlertFeed({ alerts, loading, selectedTypes, onSelect }: AlertFeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 py-2">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (selectedTypes.size === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
        <p className="text-sm text-muted-foreground">Selecione ao menos um tipo de alerta.</p>
      </div>
    );
  }

  const visible = alerts
    .filter((alert) => selectedTypes.has(alert.type))
    .sort((a, b) => Date.parse(b.emittedAt) - Date.parse(a.emittedAt));

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-safe-container">
          <ShieldCheck className="h-6 w-6 text-status-safe" strokeWidth={1.8} />
        </div>
        <p className="text-sm text-muted-foreground">Nenhum alerta recente. Joinville está tranquila no momento.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-2">
      {visible.map((alert) => (
        <AlertFeedCard key={alert.id} alert={alert} onClick={() => onSelect(alert)} />
      ))}
    </div>
  );
}
