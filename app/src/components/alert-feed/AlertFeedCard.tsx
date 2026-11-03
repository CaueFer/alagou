import type { ReactNode } from "react";
import { RiskBadge } from "@/components/civil-defense/RiskBadge";
import { getAlertTypeInfo } from "@/lib/alertType";
import { getSeverityInfo } from "@/lib/severity";
import { formatRelativeTime } from "@/lib/time";
import { formatTimeRemaining } from "@/lib/ttl";
import { cn } from "@/lib/utils";
import type { RecentAlert } from "@/types/recentAlert";

interface AlertFeedCardProps {
  alert: RecentAlert;
  onClick: () => void;
}

function formatNumber(value: number, maximumFractionDigits = 1) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits });
}

function formatMillimeters(value: number | null | undefined) {
  return value !== null && value !== undefined ? `${formatNumber(value)} mm` : "Sem leitura";
}

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 truncate text-sm font-semibold tabular-nums text-foreground">
        {children}
      </span>
    </div>
  );
}

function MetricsPanel({ children }: { children: ReactNode }) {
  return <div className="mt-3 mr-14 grid grid-cols-2 gap-3 rounded-xl bg-surface-container-lowest/40 px-3 py-2.5">{children}</div>;
}

function ClimaticDetails({ alert }: { alert: RecentAlert }) {
  const zone = alert.climaticZone;
  if (!zone) {
    return <p className="truncate text-sm text-muted-foreground">{alert.summary}</p>;
  }

  return (
    <MetricsPanel>
      <Metric label="Últimas 24h">{formatMillimeters(zone.rain?.last24Hours?.averageMm)}</Metric>
      <Metric label="Última hora">{formatMillimeters(zone.rain?.lastHour?.averageMm)}</Metric>
    </MetricsPanel>
  );
}

function UserDetails({ alert }: { alert: RecentAlert }) {
  const userAlert = alert.userAlert;
  if (!userAlert) {
    return <p className="truncate text-sm text-muted-foreground">{alert.summary}</p>;
  }

  const severity = getSeverityInfo(userAlert.severity);

  return (
    <>
      <p className="truncate text-sm text-muted-foreground">{formatTimeRemaining(userAlert.expiresAt)}</p>
      <MetricsPanel>
        <Metric label="Severidade">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: severity.markerColor }} />
          {severity.label}
        </Metric>
        <Metric label="Confirmações">{userAlert.confirmationCount}</Metric>
      </MetricsPanel>
    </>
  );
}

function CivilDefenseDetails({ alert }: { alert: RecentAlert }) {
  const notice = alert.civilDefenseNotice;

  return (
    <div className="mt-1 flex flex-col items-start gap-2 pr-12">
      <p className="line-clamp-2 text-sm text-muted-foreground">{notice?.title ?? alert.summary}</p>
      {notice && <RiskBadge level={notice.riskLevel} />}
    </div>
  );
}

export function AlertFeedCard({ alert, onClick }: AlertFeedCardProps) {
  const info = getAlertTypeInfo(alert.type);
  const Icon = info.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/50 p-4 text-left",
        "bg-linear-to-tl to-surface-container-lowest to-50%",
        info.gradientFromClass,
        "shadow-[0_1px_3px_0_rgba(11,28,48,0.08)] transition-all duration-200 ease-out",
        "hover:border-outline-variant hover:shadow-[0_6px_16px_0_rgba(11,28,48,0.14)] active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <Icon
        className={cn("pointer-events-none absolute -right-4 -bottom-4 -z-10 h-20 w-20 opacity-25", info.accentTextClass)}
        strokeWidth={2.25}
        aria-hidden="true"
      />

      <div className="flex w-full items-baseline justify-between gap-3">
        <p className="min-w-0 truncate text-base font-bold text-foreground">
          <span className="sr-only">{info.label}: </span>
          {alert.locationLabel}
        </p>
        <span className="shrink-0 text-sm text-muted-foreground">{formatRelativeTime(alert.emittedAt)}</span>
      </div>

      <div className="w-full">
        {alert.type === "CLIMATIC" && <ClimaticDetails alert={alert} />}
        {alert.type === "USER" && <UserDetails alert={alert} />}
        {alert.type === "CIVIL_DEFENSE" && <CivilDefenseDetails alert={alert} />}
      </div>
    </button>
  );
}
