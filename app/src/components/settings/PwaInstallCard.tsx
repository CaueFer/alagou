import { Download, Share } from "lucide-react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export function PwaInstallCard() {
  const { state, promptInstall } = usePwaInstall();

  if (state === "unavailable" || state === "installed") {
    return null;
  }

  return (
    <SettingsSection title="Instalar o app">
      {state === "installable" ? (
        <div className="flex flex-col gap-3 py-3.5">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">Adicionar à tela inicial</p>
            <p className="text-sm text-muted-foreground">
              Instale o Alagou para abrir mais rápido, usar em tela cheia e receber notificações de alagamento.
            </p>
          </div>
          <Button type="button" onClick={() => void promptInstall()}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Instalar app
          </Button>
        </div>
      ) : (
        <div className="flex items-start gap-3 py-3.5">
          <Share className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">Adicionar à tela inicial</p>
            <p className="text-sm text-muted-foreground">
              Toque em Compartilhar no Safari e escolha "Adicionar à Tela de Início" para instalar o Alagou e liberar as
              notificações.
            </p>
          </div>
        </div>
      )}
    </SettingsSection>
  );
}
