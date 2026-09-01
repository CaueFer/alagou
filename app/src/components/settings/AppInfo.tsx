import { Bug, Code2, ExternalLink } from "lucide-react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";

const REPOSITORY_URL = "https://github.com/CaueFer/alagou";
const ISSUES_URL = "https://github.com/CaueFer/alagou/issues/new";

const DATA_SOURCES = [
  {
    name: "Prefeitura de Joinville",
    description: "Câmeras de monitoramento em tempo real.",
  },
  {
    name: "CEMADEN",
    description: "Dados meteorológicos e de monitoramento de riscos.",
  },
  {
    name: "Defesa Civil",
    description: "Avisos oficiais e orientações à população.",
  },
];

export function AppInfo() {
  return (
    <SettingsSection title="Sobre o app">
      <div className="flex min-h-14 items-center justify-between gap-4 py-3.5">
        <p className="text-sm font-medium">Versão</p>
        <p className="text-sm text-muted-foreground tabular-nums">{__APP_VERSION__}</p>
      </div>

      <a
        href={REPOSITORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-between gap-4 py-3.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <span className="flex items-center gap-2">
          <Code2 className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium">Código-fonte no GitHub</span>
        </span>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </a>

      <div className="py-3.5">
        <p className="text-sm font-medium">Créditos</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Alagou é um projeto de código aberto criado para ajudar Joinville a enfrentar alagamentos.
        </p>
      </div>

      <div className="py-3.5">
        <p className="text-sm font-medium">Fontes de dados</p>
        <ul className="mt-2 flex flex-col gap-2">
          {DATA_SOURCES.map((source) => (
            <li key={source.name} className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{source.name}</span>
              <span className="text-sm text-muted-foreground">{source.description}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="py-3.5">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(ISSUES_URL, "_blank", "noopener,noreferrer")}
        >
          <Bug className="h-4 w-4" aria-hidden="true" />
          Reportar um problema
        </Button>
      </div>
    </SettingsSection>
  );
}
