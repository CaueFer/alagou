import { Code2, ExternalLink, Bug } from "lucide-react";
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
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Sobre o app</h2>

      <div className="flex flex-col pl-3 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
        <div className="flex items-center justify-between gap-3 border-b border-border py-3">
          <p className="text-sm font-medium">Versão</p>
          <p className="text-sm text-muted-foreground">{__APP_VERSION__}</p>
        </div>

        <a
          href={REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-between gap-3 border-b border-border py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium">Código-fonte no GitHub</span>
          </span>
          <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </a>

        <div className="border-b border-border py-3">
          <p className="text-sm font-medium">Créditos</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Alagou é um projeto de código aberto criado para ajudar Joinville a enfrentar alagamentos.
          </p>
        </div>

        <div className="border-b border-border py-3">
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

        <div className="pt-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(ISSUES_URL, "_blank", "noopener,noreferrer")}
          >
            <Bug className="h-4 w-4" aria-hidden="true" />
            Reportar um problema
          </Button>
        </div>
      </div>
    </section>
  );
}