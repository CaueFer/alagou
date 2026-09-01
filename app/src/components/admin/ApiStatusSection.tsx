import { Badge } from "@/components/ui/badge";
import { formatFullTimestamp } from "@/lib/time";
import type { ApiStatus } from "@/types/admin";

interface ApiStatusSectionProps {
  apiStatus: ApiStatus | null;
  status: "loading" | "ready" | "error";
}

export function ApiStatusSection({ apiStatus, status }: ApiStatusSectionProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Status da API</span>
          <h2 className="text-lg font-semibold text-foreground">Painel de operação</h2>
        </div>
        <Badge
          variant="outline"
          className={
            apiStatus === null
              ? "border-border bg-muted text-muted-foreground"
              : apiStatus.status === "UP"
              ? "border-status-safe bg-status-safe-container text-status-safe"
              : "border-severity-critical bg-severity-critical-container text-severity-critical"
          }
        >
          {status === "error" ? "Indisponível" : apiStatus?.status ?? "Carregando"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted p-3">
          <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Banco</div>
          <div className="mt-1 text-base font-semibold text-foreground">{apiStatus?.database ?? "..."}</div>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Versão</div>
          <div className="mt-1 text-base font-semibold text-foreground">{apiStatus?.version ?? "..."}</div>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Uptime</div>
          <div className="mt-1 text-base font-semibold text-foreground">
            {apiStatus ? `${Math.floor(apiStatus.uptimeSeconds / 60)} min` : "..."}
          </div>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Atualização</div>
          <div className="mt-1 text-base font-semibold text-foreground">
            {apiStatus ? formatFullTimestamp(apiStatus.timestamp) : "..."}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {status === "error"
          ? "Não foi possível consultar o estado atual da API."
          : apiStatus
            ? `API em ${apiStatus.status.toLowerCase()} desde ${formatFullTimestamp(apiStatus.startedAt)}.`
            : "Carregando estado atual da API."}
      </p>
    </section>
  );
}
