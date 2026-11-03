import { useState } from "react";
import { Bug, ChevronRight, Code2, Database, ExternalLink, Info } from "lucide-react";
import { DataSourcesSheet } from "@/components/settings/DataSourcesSheet";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";

const REPOSITORY_URL = "https://github.com/CaueFer/alagou";
const ISSUES_URL = "https://github.com/CaueFer/alagou/issues/new";

const rowClass =
  "-mx-2 flex min-h-12 w-[calc(100%+1rem)] items-center justify-between gap-4 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary";

export function AppInfo() {
  const [dataSourcesOpen, setDataSourcesOpen] = useState(false);

  return (
    <SettingsSection title="Sobre o app" icon={<Info aria-hidden="true" />}>
      <div className="flex min-h-12 items-center justify-between gap-4 py-2.5">
        <p className="text-base font-medium">Versão</p>
        <p className="text-sm text-muted-foreground tabular-nums">{__APP_VERSION__}</p>
      </div>

      <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className={rowClass}>
        <span className="flex items-center gap-3">
          <Code2 className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="text-base font-medium">Código-fonte no GitHub</span>
        </span>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </a>

      <button type="button" className={rowClass} onClick={() => setDataSourcesOpen(true)}>
        <span className="flex items-center gap-3">
          <Database className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="text-base font-medium">Fontes de dados</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>

      <Button asChild variant="secondary" className="mt-2 w-full">
        <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
          <Bug className="h-4 w-4" aria-hidden="true" />
          Reportar um problema
        </a>
      </Button>

      <DataSourcesSheet open={dataSourcesOpen} onOpenChange={setDataSourcesOpen} />
    </SettingsSection>
  );
}
