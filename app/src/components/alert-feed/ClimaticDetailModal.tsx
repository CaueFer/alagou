import { CloudRain, Waves } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { formatFullTimestamp } from "@/lib/time";
import type { ClimaticZoneSnapshot } from "@/types/recentAlert";

interface ClimaticDetailModalProps {
  zone: ClimaticZoneSnapshot | null;
  open: boolean;
  onClose: () => void;
}

export function ClimaticDetailModal({ zone, open, onClose }: ClimaticDetailModalProps) {
  if (!zone) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{zone.zoneName}</DrawerTitle>
          <DrawerDescription>Condições climáticas monitoradas na zona</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
          {zone.rivers.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <CloudRain className="h-4 w-4 text-alert-climatic" strokeWidth={1.8} />
                Nível dos rios
              </h3>
              {zone.rivers.map((river) => (
                <div key={river.stationCode} className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{river.stationName}</span>
                  <span className="font-medium text-foreground">
                    {river.level !== null ? `${river.level.toFixed(2)} m` : "Sem leitura"}
                  </span>
                </div>
              ))}
            </section>
          )}

          {zone.tide && (
            <section className="flex flex-col gap-2">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Waves className="h-4 w-4 text-alert-climatic" strokeWidth={1.8} />
                Maré
              </h3>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Nível atual</span>
                <span className="font-medium text-foreground">
                  {zone.tide.currentLevel !== null ? `${zone.tide.currentLevel.toFixed(2)} m` : "Sem leitura"}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Situação</span>
                <span className="font-medium text-foreground">{zone.tide.status}</span>
              </div>
            </section>
          )}

          <p className="text-xs text-muted-foreground">Última atualização: {formatFullTimestamp(zone.lastUpdate)}</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
