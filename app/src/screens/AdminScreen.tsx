import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Globe,
  KeyRound,
  Megaphone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

  const { overview, status: overviewStatus, refetch: refetchOverview } = useAdminOverview(isAdmin);
  const { apiStatus, status: apiStatusState, refetch: refetchApiStatus } = useApiStatus(isAdmin);
  const { schedulers, status: schedulerStatus, refetch: refetchSchedulers } = useSchedulerStatuses(isAdmin);
  const alertFilters = useMemo(
    () => ({
      active: activeScope === "active" ? true : null,
      type: type === "all" ? null : type,
      severity: severity === "all" ? null : severity,
      order,
    }),
    [activeScope, type, severity, order],
  );

  const { alerts, status: alertsStatus, refetch: refetchAlerts } = useAdminAlerts(
    alertFilters,
    isAdmin,
  );

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([
        refetchOverview(),
        refetchApiStatus(),
        refetchSchedulers(),
        refetchAlerts(),
      ]);
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

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
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface-container-lowest p-5 text-center shadow-sm">
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
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/perfil")}
          className="-ml-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao perfil
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pt-3">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#0b1c30_0%,#111e38_60%,#162744_100%)] p-5 text-white shadow-md">
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

        {overviewStatus === "error" ? (
          <div className="flex items-center justify-between rounded-2xl border border-severity-critical/30 bg-severity-critical-container p-4 text-sm text-severity-critical">
            <span>Não foi possível carregar os dados de resumo.</span>
            <Button variant="outline" size="sm" onClick={refetchOverview}>
              Tentar novamente
            </Button>
          </div>
        ) : null}

        <section className="grid grid-cols-2 gap-3">
          <StatsCard
            label="Alertas ativos"
            value={String(overview?.activeAlerts ?? "...")}
            description="Marcadores em aberto no mapa."
            icon={AlertTriangle}
            tone="amber"
          />
          <StatsCard
            label="Total de alertas"
            value={String(overview?.totalAlerts ?? "...")}
            description="Inclui histórico e alertas expirados."
            icon={Activity}
            tone="blue"
          />
          <StatsCard
            label="Contas Google"
            value={String(overview?.googleAccounts ?? "...")}
            description="Login social habilitado."
            icon={Globe}
            tone="blue"
          />
          <StatsCard
            label="Contas por senha"
            value={String(overview?.passwordAccounts ?? "...")}
            description="Login local com e-mail e senha."
            icon={KeyRound}
            tone="purple"
          />
          <StatsCard
            label="Confirmações"
            value={String(overview?.totalConfirmations ?? "...")}
            description="Confirmações acumuladas."
            icon={CheckCircle2}
            tone="green"
          />
          <StatsCard
            label="Pista limpa"
            value={String(overview?.totalClearReports ?? "...")}
            description="Relatos de via desobstruída."
            icon={ShieldCheck}
            tone="green"
          />
          <StatsCard
            label="Alertas expirados"
            value={String(overview?.expiredAlerts ?? "...")}
            description="Alertas vencidos no banco."
            icon={Clock}
            tone="default"
          />
          <StatsCard
            label="Avisos Defesa Civil"
            value={String(overview?.totalCivilDefenseNotices ?? "...")}
            description="Avisos oficiais armazenados."
            icon={Megaphone}
            tone="red"
          />
        </section>

        <ApiStatusSection apiStatus={apiStatus} status={apiStatusState} />

        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-sm">
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
