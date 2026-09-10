import { AlertTriangle, CheckCircle2, Clock, LogOut, ShieldAlert, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/useAlerts";
import { getSeverityInfo } from "@/lib/severity";
import { formatTimeRemaining } from "@/lib/ttl";
import type { User } from "@/types/user";

interface AccountSummaryProps {
  user: User;
  onLogout: () => void;
}

export function AccountSummary({ user, onLogout }: AccountSummaryProps) {
  const { alerts } = useAlerts();

  const userNameLower = (user.name ?? "").trim().toLowerCase();
  const userEmailLower = user.email.trim().toLowerCase();

  const myAlerts = alerts.filter((alert) => {
    if (!alert.username) return false;
    const author = alert.username.trim().toLowerCase();
    return author === userNameLower || author === userEmailLower;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        {user.pictureUrl ? (
          <img src={user.pictureUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
        ) : (
          <UserCircle className="h-14 w-14 shrink-0 text-foreground" strokeWidth={1.25} />
        )}
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Conta</span>
          <span className="mt-0.5 truncate text-xl font-bold tracking-[-0.01em]">{user.name ?? user.email}</span>
          {user.name ? <span className="truncate text-sm text-muted-foreground">{user.email}</span> : null}
        </div>
      </div>

      {user.createdAt ? (
        <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Membro desde</span>
          <span className="text-sm font-medium tabular-nums">
            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meus relatos ativos</span>
          <Badge variant="outline" className="tabular-nums">
            {myAlerts.length}
          </Badge>
        </div>

        {myAlerts.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Você não possui relatos de alagamento ativos no momento.
          </p>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            {myAlerts.map((alert) => {
              const severityInfo = getSeverityInfo(alert.severity);
              return (
                <div
                  key={alert.id}
                  className="flex flex-col gap-2 rounded-xl border border-border/80 bg-muted/40 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: severityInfo.markerColor }}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {severityInfo.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeRemaining(alert.expiresAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-status-safe" />
                      {alert.confirmationCount} confirmações
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                      {alert.clearReportCount} pista limpa
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}
