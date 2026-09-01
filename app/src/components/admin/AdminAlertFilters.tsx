import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import type { AlertType, Severity } from "@/types/alert";

interface AdminAlertFiltersProps {
  activeScope: "active" | "all";
  type: AlertType | "all";
  severity: Severity | "all";
  order: "recent" | "old";
  onActiveScopeChange: (value: "active" | "all") => void;
  onTypeChange: (value: AlertType | "all") => void;
  onSeverityChange: (value: Severity | "all") => void;
  onOrderChange: (value: "recent" | "old") => void;
}

export function AdminAlertFilters({
  activeScope,
  type,
  severity,
  order,
  onActiveScopeChange,
  onTypeChange,
  onSeverityChange,
  onOrderChange,
}: AdminAlertFiltersProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Alertas</span>
        <h2 className="text-lg font-semibold text-foreground">Lista com filtros e ordenação</h2>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Escopo</span>
          <SegmentedControl
            options={[
              { value: "active", label: "Ativos" },
              { value: "all", label: "Todos" },
            ]}
            value={activeScope}
            onValueChange={onActiveScopeChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Tipo</span>
          <SegmentedControl
            options={[
              { value: "all", label: "Todos" },
              { value: "USER", label: "Cidadãos" },
              { value: "CLIMATIC", label: "Climático" },
              { value: "CIVIL_DEFENSE", label: "Defesa Civil" },
            ]}
            value={type}
            onValueChange={onTypeChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Severidade</span>
          <SegmentedControl
            options={[
              { value: "all", label: "Todas" },
              { value: "MODERATE", label: "Moderado" },
              { value: "SEVERE", label: "Grave" },
              { value: "CRITICAL", label: "Crítico" },
            ]}
            value={severity}
            onValueChange={onSeverityChange}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-muted p-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Somente alertas ativos</span>
            <span className="text-sm text-muted-foreground">Alterna entre alertas em aberto e o histórico completo.</span>
          </div>
          <Switch checked={activeScope === "active"} onCheckedChange={(checked) => onActiveScopeChange(checked ? "active" : "all")} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Ordenação</span>
          <SegmentedControl
            options={[
              { value: "recent", label: "Mais recentes" },
              { value: "old", label: "Mais antigos" },
            ]}
            value={order}
            onValueChange={onOrderChange}
          />
        </div>
      </div>
    </section>
  );
}
