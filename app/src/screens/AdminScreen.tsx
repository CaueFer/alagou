import { ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { AdminAlertCard } from "@/components/admin/AdminAlertCard";
import { AdminAlertFilters } from "@/components/admin/AdminAlertFilters";
import { ApiStatusSection } from "@/components/admin/ApiStatusSection";
import { SchedulerStatusList } from "@/components/admin/SchedulerStatusList";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAuth } from "@/hooks/useAuth";
import { getAlertTypeInfo } from "@/lib/alertType";
import { useAdminAlerts, useAdminOverview, useApiStatus, useSchedulerStatuses } from "@/hooks/useAdminData";
import type { AlertType, Severity } from "@/types/alert";

export function AdminScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [activeScope, setActiveScope] = useState<"active" | "all">("active");
  const [type, setType] = useState<AlertType | "all">("all");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [order, setOrder] = useState<"recent" | "old">("recent");

  const { overview } = useAdminOverview(isAdmin);
  const { apiStatus, status: apiStatusState } = useApiStatus(isAdmin);
  const { schedulers, status: schedulerStatus } = useSchedulerStatuses(isAdmin);
  const alertFilters = useMemo(
    () => ({
      active: activeScope === "active" ? true : null,
      type: type === "all" ? null : type,
      severity: severity === "all" ? null : severity,
      order,
    }),
    [activeScope, type, severity, order],
  );

  const { alerts, status: alertsStatus } = useAdminAlerts(
    alertFilters,
    isAdmin,
  );

  const formatAlertType = (value: string) => {
    if (value === "USER" || value === "CLIMATIC" || value === "CIVIL_DEFENSE") {
      return getAlertTypeInfo(value).label;
    }
    return value;
  };

  const formatSeverity = (value: string) => {
    if (value === "MODERATE") {
      return "Moderado";
    }
    if (value === "SEVERE") {
      return "Grave";
    }
    if (value === "CRITICAL") {
      return "Crítico";
    }
    return value;
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full w-full flex-col overflow-y-auto" style={{ paddingBottom: "var(--bottom-nav-clearance)" }}>
        <FloatingBadge position="sticky">Admin</FloatingBadge>
        <div className="flex flex-1 items-center justify-center px-4 pt-6">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface-container-lowest p-5 text-center shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-severity-critical-container">
              <ShieldCheck className="h-6 w-6 text-severity-critical" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold text-foreground">Acesso restrito</h1>
              <p className="text-sm text-muted-foreground">Este painel fica disponível apenas para contas administradoras.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/perfil")}>
              Voltar ao perfil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto" style={{ paddingBottom: "var(--bottom-nav-clearance)" }}>
      <FloatingBadge position="sticky">Admin</FloatingBadge>

      <div className="flex flex-col gap-6 px-4 pt-4">
        <section className="overflow-hidden rounded-2xl border border-primary/10 bg-[linear-gradient(135deg,#0b1c30_0%,#131b2e_62%,#e5eeff_100%)] p-5 text-white shadow-[0_4px_12px_0_rgba(11,28,48,0.14)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-on-primary-container">Observabilidade</span>
                <h1 className="text-2xl font-semibold leading-tight">Painel de operação</h1>
                <p className="max-w-md text-sm text-white/80">
                  Acompanhe contas, alertas, presença em tempo real e o estado dos jobs automáticos da API.
                </p>
              </div>
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                {user?.name ?? user?.email}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Usuários abertos agora</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{overview?.activeUsers ?? "..."}</div>
              </div>
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Contas criadas</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{overview?.totalUsers ?? "..."}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <StatsCard label="Alertas ativos" value={String(overview?.activeAlerts ?? "...")} description="Marcadores em aberto no mapa." />
          <StatsCard label="Total de alertas" value={String(overview?.totalAlerts ?? "...")} description="Inclui histórico e alertas expirados." />
          <StatsCard label="Contas Google" value={String(overview?.googleAccounts ?? "...")} description="Login social habilitado." />
          <StatsCard label="Contas por senha" value={String(overview?.passwordAccounts ?? "...")} description="Login local com e-mail e senha." />
          <StatsCard label="Confirmações" value={String(overview?.totalConfirmations ?? "...")} description="Confirmações acumuladas." />
          <StatsCard label="Pista limpa" value={String(overview?.totalClearReports ?? "...")} description="Relatos de via desobstruída." />
          <StatsCard label="Alertas expirados" value={String(overview?.expiredAlerts ?? "...")} description="Alertas vencidos no banco." />
          <StatsCard label="Avisos Defesa Civil" value={String(overview?.totalCivilDefenseNotices ?? "...")} description="Avisos oficiais armazenados." />
        </section>

        <ApiStatusSection apiStatus={apiStatus} status={apiStatusState} />

        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Resumo por origem</span>
            <h2 className="text-lg font-semibold text-foreground">Alertas por tipo e severidade</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(overview?.alertsByType ?? {}).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-muted p-3">
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{formatAlertType(key)}</div>
                <div className="mt-1 text-base font-semibold text-foreground">{value}</div>
              </div>
            ))}
            {Object.entries(overview?.alertsBySeverity ?? {}).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-muted p-3">
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{formatSeverity(key)}</div>
                <div className="mt-1 text-base font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <SchedulerStatusList schedulers={schedulers} status={schedulerStatus} />

        <AdminAlertFilters
          activeScope={activeScope}
          type={type}
          severity={severity}
          order={order}
          onActiveScopeChange={setActiveScope}
          onTypeChange={setType}
          onSeverityChange={setSeverity}
          onOrderChange={setOrder}
        />

        <section className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <AdminAlertCard key={alert.id} alert={alert} />
          ))}
          {alertsStatus === "loading" ? (
            <div className="rounded-2xl border border-border bg-surface-container-lowest p-4 text-sm text-muted-foreground shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
              Carregando alertas...
            </div>
          ) : alertsStatus === "error" ? (
            <div className="rounded-2xl border border-severity-critical/30 bg-severity-critical-container p-4 text-sm text-severity-critical shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
              Não foi possível carregar os alertas administrativos agora.
            </div>
          ) : alerts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-container-lowest p-4 text-sm text-muted-foreground shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
              Nenhum alerta encontrado para os filtros atuais.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
