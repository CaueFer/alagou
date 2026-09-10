import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Maximize2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFullTimestamp, formatRelativeTime } from "@/lib/time";
import { getAlertTypeInfo } from "@/lib/alertType";
import { API_BASE_URL } from "@/lib/constants";
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
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const typeInfo = getAlertTypeInfo(alert.type as RecentAlertType);

  const resolvePhotoUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleViewOnMap = () => {
    navigate("/", { state: { focusLocation: alert.location } });
  };

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-border bg-surface-container-lowest shadow-sm">
        <div
          className={cn(
            "h-1.5",
            alert.severity === "MODERATE"
              ? "bg-severity-moderate"
              : alert.severity === "SEVERE"
              ? "bg-severity-severe"
              : "bg-severity-critical",
          )}
        />
        <div className="flex flex-col gap-3.5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("border-transparent", typeInfo.containerBgClass, typeInfo.containerTextClass)}
                >
                  {getAlertTypeLabel(alert.type)}
                </Badge>
                <Badge variant="outline" className={getSeverityClasses(alert.severity)}>
                  {getSeverityLabel(alert.severity)}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    alert.active
                      ? "border-status-safe bg-status-safe-container text-status-safe"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {alert.active ? "Ativo" : "Expirado"}
                </Badge>
              </div>
              <h3 className="text-base font-semibold text-foreground">{alert.username}</h3>
              <p className="font-mono text-xs text-muted-foreground">
                {alert.location.lat.toFixed(5)}, {alert.location.lng.toFixed(5)}
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>{formatRelativeTime(alert.creationDate)}</div>
              <div className="mt-0.5">{formatFullTimestamp(alert.creationDate)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-sm">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Confirmações
              </div>
              <div className="mt-1 text-base font-semibold text-foreground">{alert.confirmationCount}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Pista limpa
              </div>
              <div className="mt-1 text-base font-semibold text-foreground">{alert.clearReportCount}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Expiração
              </div>
              <div className="mt-1 text-base font-semibold text-foreground">
                {formatRelativeTime(alert.expirationDate)}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Fotos</div>
              <div className="mt-1 text-base font-semibold text-foreground">{alert.photoUrls.length}</div>
            </div>
          </div>

          {alert.photoUrls.length > 0 ? (
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                Fotos anexadas
              </span>
              <div className="grid grid-cols-3 gap-2">
                {alert.photoUrls.map((photo, index) => {
                  const resolved = resolvePhotoUrl(photo);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedPhoto(resolved)}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <img
                        src={resolved}
                        alt="Foto do alagamento"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <Maximize2 className="h-4 w-4 text-white" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-end border-t border-border/60 pt-3">
            <Button variant="outline" size="sm" onClick={handleViewOnMap} className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Ver no mapa
            </Button>
          </div>
        </div>
      </article>

      {selectedPhoto ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={selectedPhoto} alt="Foto ampliada do alagamento" className="max-h-[80vh] w-auto object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
