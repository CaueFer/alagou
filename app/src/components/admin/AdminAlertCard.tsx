import { Badge } from "@/components/ui/badge";
import { formatFullTimestamp, formatRelativeTime } from "@/lib/time";
import { getAlertTypeInfo } from "@/lib/alertType";
import type { AdminAlert } from "@/types/admin";
import type { RecentAlertType } from "@/types/recentAlert";
import { cn } from "@/lib/utils";

interface AdminAlertCardProps {
  alert: AdminAlert;
}

function getAlertTypeLabel(type: AdminAlert["type"]) {
  return getAlertTypeInfo(type as RecentAlertType).label;
}

function getSeverityLabel(severity: AdminAlert["severity"]) {
  if (severity === "MODERATE") {
    return "Moderado";
  }
  if (severity === "SEVERE") {
    return "Grave";
  }
  return "Crítico";
}

function getSeverityClasses(severity: AdminAlert["severity"]) {
  if (severity === "MODERATE") {
    return "bg-severity-moderate-container text-severity-moderate";
  }
  if (severity === "SEVERE") {
    return "bg-severity-severe-container text-severity-severe";
  }
  return "bg-severity-critical-container text-severity-critical";
}

export function AdminAlertCard({ alert }: AdminAlertCardProps) {
  const typeInfo = getAlertTypeInfo(alert.type as RecentAlertType);

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
      <div className={cn("h-1.5", alert.severity === "MODERATE" ? "bg-severity-moderate" : alert.severity === "SEVERE" ? "bg-severity-severe" : "bg-severity-critical")} />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn("border-transparent", typeInfo.containerBgClass, typeInfo.containerTextClass)}>
                {getAlertTypeLabel(alert.type)}
              </Badge>
              <Badge variant="outline" className={getSeverityClasses(alert.severity)}>
                {getSeverityLabel(alert.severity)}
              </Badge>
              <Badge variant="outline" className={alert.active ? "border-status-safe bg-status-safe-container text-status-safe" : "border-border bg-muted text-muted-foreground"}>
                {alert.active ? "Ativo" : "Expirado"}
              </Badge>
            </div>
            <h3 className="text-base font-semibold text-foreground">{alert.username}</h3>
            <p className="text-sm text-muted-foreground">Localização registrada no mapa interno.</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>{formatRelativeTime(alert.creationDate)}</div>
            <div>{formatFullTimestamp(alert.creationDate)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Confirmações</div>
            <div className="mt-1 text-base font-semibold text-foreground">{alert.confirmationCount}</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Pista limpa</div>
            <div className="mt-1 text-base font-semibold text-foreground">{alert.clearReportCount}</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Expiração</div>
            <div className="mt-1 text-base font-semibold text-foreground">{formatRelativeTime(alert.expirationDate)}</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Fotos</div>
            <div className="mt-1 text-base font-semibold text-foreground">{alert.photoUrls.length}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
