import { Bug, Code2, ExternalLink, Info } from "lucide-react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";

const REPOSITORY_URL = "https://github.com/CaueFer/alagou";
const ISSUES_URL = "https://github.com/CaueFer/alagou/issues/new";

const DATA_SOURCES = [
  {
    name: "CEMADEN",
    description: "Chuva acumulada medida pelos pluviômetros de Joinville.",
    url: "https://www.gov.br/cemaden",
  },
  {
    name: "Open-Meteo",
    description: "Previsão do tempo, chuva por zona e vazão dos rios.",
    url: "https://open-meteo.com",
  },
  {
    name: "WorldTides",
    description: "Previsão de maré na Baía da Babitonga.",
    url: "https://www.worldtides.info",
  },
  {
    name: "Defesa Civil de Joinville",
    description: "Avisos oficiais e níveis de risco para a população.",
    url: "https://www.joinville.sc.gov.br",
  },
  {
    name: "Prefeitura de Joinville",
    description: "Câmeras de monitoramento em tempo real.",
    url: "https://www.joinville.sc.gov.br",
  },
  {
    name: "OpenStreetMap",
    description: "Mapa base e busca de endereços.",
    url: "https://www.openstreetmap.org",
  },
  {
    name: "Esri World Imagery",
    description: "Imagens de satélite do mapa.",
    url: "https://www.esri.com",
  },
];

const linkRowClass =
  "-mx-4 flex min-h-14 items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary";

export function AppInfo() {
  return (
    <SettingsSection title="Sobre o app" icon={<Info className="h-3.5 w-3.5" aria-hidden="true" />}>
      <div className="flex min-h-14 items-center justify-between gap-4 py-3.5">
        <p className="text-sm font-medium">Versão</p>
        <p className="text-sm text-muted-foreground tabular-nums">{__APP_VERSION__}</p>
      </div>

      <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className={linkRowClass}>
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

      <div className="pt-3.5">
        <p className="text-sm font-medium">Fontes de dados</p>
        <ul className="mt-1 flex flex-col divide-y divide-border/60">
          {DATA_SOURCES.map((source) => (
            <li key={source.name}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkRowClass}
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium">{source.name}</span>
                  <span className="text-sm text-muted-foreground">{source.description}</span>
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="py-3.5">
        <Button asChild variant="outline" className="w-full">
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
            <Bug className="h-4 w-4" aria-hidden="true" />
            Reportar um problema
          </a>
        </Button>
      </div>
    </SettingsSection>
  );
}
