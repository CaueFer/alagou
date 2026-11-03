import { ExternalLink } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

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

interface DataSourcesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataSourcesSheet({ open, onOpenChange }: DataSourcesSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Fontes de dados</DrawerTitle>
          <DrawerDescription>
            Alagou é um projeto de código aberto criado para ajudar Joinville a enfrentar alagamentos, combinando
            relatos de cidadãos com estes dados públicos.
          </DrawerDescription>
        </DrawerHeader>
        <ul className="flex flex-col gap-1 overflow-y-auto px-2 pb-6">
          {DATA_SOURCES.map((source) => (
            <li key={source.name}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center justify-between gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-base font-medium">{source.name}</span>
                  <span className="text-sm text-muted-foreground">{source.description}</span>
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
