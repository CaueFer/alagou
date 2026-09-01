import { Badge } from "@/components/ui/badge";
import { formatFullTimestamp, formatRelativeTime } from "@/lib/time";
import type { SchedulerStatus } from "@/types/admin";
import { SchedulerStatusBadge } from "@/components/admin/SchedulerStatusBadge";

interface SchedulerStatusListProps {
  schedulers: SchedulerStatus[];
  status?: "loading" | "ready" | "error";
}

export function SchedulerStatusList({ schedulers, status = "loading" }: SchedulerStatusListProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Schedulers</span>
        <h2 className="text-lg font-semibold text-foreground">Execuções e falhas recentes</h2>
      </div>

      <div className="flex flex-col gap-3">
        {status === "loading" ? (
          <div className="rounded-xl border border-outline-variant/70 bg-muted/40 p-4 text-sm text-muted-foreground">
            Carregando schedulers...
          </div>
        ) : null}
        {status === "error" ? (
          <div className="rounded-xl border border-severity-critical/30 bg-severity-critical-container p-4 text-sm text-severity-critical">
            Não foi possível carregar o status dos schedulers agora.
          </div>
        ) : null}
        {schedulers.map((scheduler) => (
          <article key={scheduler.id} className="rounded-xl border border-outline-variant/70 bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{scheduler.name}</h3>
                  <SchedulerStatusBadge status={scheduler.status} />
                </div>
                <p className="text-sm text-muted-foreground">{scheduler.description}</p>
              </div>
              <Badge variant="outline" className="border-border bg-background text-muted-foreground">
                {scheduler.interval}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-background p-3">
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Última execução</div>
                <div className="mt-1 font-medium text-foreground">
                  {scheduler.lastRunAt ? formatRelativeTime(scheduler.lastRunAt) : "Nunca"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {scheduler.lastRunAt ? formatFullTimestamp(scheduler.lastRunAt) : "Sem histórico"}
                </div>
              </div>
              <div className="rounded-lg bg-background p-3">
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Próxima previsão</div>
                <div className="mt-1 font-medium text-foreground">
                  {scheduler.nextExpectedRunAt ? formatRelativeTime(scheduler.nextExpectedRunAt) : "Sem previsão"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {scheduler.nextExpectedRunAt ? formatFullTimestamp(scheduler.nextExpectedRunAt) : "Aguardando primeira execução"}
                </div>
              </div>
              <div className="rounded-lg bg-background p-3">
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Duração</div>
                <div className="mt-1 font-medium text-foreground">
                  {scheduler.lastDurationMs > 0 ? `${scheduler.lastDurationMs} ms` : "Sem dado"}
                </div>
                <div className="text-xs text-muted-foreground">{scheduler.runCount} execuções</div>
              </div>
              <div className="rounded-lg bg-background p-3">
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Falhas</div>
                <div className="mt-1 font-medium text-foreground">{scheduler.failureCount}</div>
                <div className="text-xs text-muted-foreground">
                  {scheduler.lastErrorAt ? formatRelativeTime(scheduler.lastErrorAt) : "Sem falhas recentes"}
                </div>
              </div>
            </div>

            {scheduler.lastErrorMessage ? (
              <p className="mt-3 rounded-lg bg-severity-critical-container p-3 text-sm text-severity-critical">
                {scheduler.lastErrorMessage}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
