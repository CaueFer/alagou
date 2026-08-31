import { CloudRain, Waves, Wind } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { formatFullTimestamp } from "@/lib/time";
import type { ClimaticRainWindow, ClimaticZoneSnapshot } from "@/types/recentAlert";

interface ClimaticDetailModalProps {
  zone: ClimaticZoneSnapshot | null;
  open: boolean;
  onClose: () => void;
}

function formatMillimeters(value: number | null | undefined) {
  return value !== null && value !== undefined ? `${value.toFixed(1)} mm` : "Sem leitura";
}

function RainWindowRow({ label, window }: { label: string; window: ClimaticRainWindow | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{formatMillimeters(window?.averageMm)}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Pluviômetro {formatMillimeters(window?.measuredMm)} · Previsão {formatMillimeters(window?.forecastMm)}
      </p>
    </div>
  );
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
          {zone.rain && (
            <section className="flex flex-col gap-2">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <CloudRain className="h-4 w-4 text-alert-climatic" strokeWidth={1.8} />
                Chuva
              </h3>
              <RainWindowRow label="Última hora" window={zone.rain.lastHour} />
              <RainWindowRow label="Últimas 24h" window={zone.rain.last24Hours} />
              {zone.rain.stationNames.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Estações do CEMADEN: {zone.rain.stationNames.join(", ")}
                </p>
              )}
            </section>
          )}

          {zone.river && zone.river.dischargeCubicMetersPerSecond !== null && (
            <section className="flex flex-col gap-2">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Wind className="h-4 w-4 text-alert-climatic" strokeWidth={1.8} />
                Vazão do rio
              </h3>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Hoje</span>
                <span className="font-medium text-foreground">
                  {zone.river.dischargeCubicMetersPerSecond.toFixed(2)} m³/s
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Pico previsto (3 dias)</span>
                <span className="font-medium text-foreground">
                  {zone.river.forecastPeakCubicMetersPerSecond !== null
                    ? `${zone.river.forecastPeakCubicMetersPerSecond.toFixed(2)} m³/s`
                    : "Sem previsão"}
                </span>
              </div>
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
                  {zone.tide.nearestExtremeHeightMeters !== null ? `${zone.tide.nearestExtremeHeightMeters.toFixed(2)} m` : "Sem leitura"}
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
