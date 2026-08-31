import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatRelativeTime } from "@/lib/time";
import { getRiskLevelInfo } from "@/lib/riskLevel";
import { getRainStatusInfo, getRiverStatusInfo, getZoneStatusInfo } from "@/lib/zoneStatus";
import type { TideStatus, Zone, ZoneRainWindow } from "@/types/zone";

const TIDE_STATUS_LABEL: Record<TideStatus, string> = {
  HIGH_TIDE: "Maré alta",
  LOW_TIDE: "Maré baixa",
  UNKNOWN: "Sem dado",
};

function formatMillimeters(value: number | null | undefined) {
  return value !== null && value !== undefined ? `${value.toFixed(1)} mm` : "sem leitura";
}

function RainWindowRow({ label, window }: { label: string; window: ZoneRainWindow | null }) {
  return (
    <div className="mt-1">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{formatMillimeters(window?.averageMm)}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Pluviômetro {formatMillimeters(window?.measuredMm)} · Previsão {formatMillimeters(window?.forecastMm)}
      </p>
    </div>
  );
}

const CIVIL_DEFENSE_NONE_INFO = {
  label: "Sem aviso",
  bgClass: "bg-border",
  textClass: "text-muted-foreground",
};

interface ZoneDetailSheetProps {
  zone: Zone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ZoneDetailSheet({ zone, open, onOpenChange }: ZoneDetailSheetProps) {
  if (!zone) {
    return null;
  }

  const zoneInfo = getZoneStatusInfo(zone.overallStatus);
  const civilDefenseLevel = zone.civilDefense.riskLevel;
  const civilDefenseInfo =
    civilDefenseLevel === "NONE" ? CIVIL_DEFENSE_NONE_INFO : getRiskLevelInfo(civilDefenseLevel);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <span
            className={`inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${zoneInfo.bgClass} ${zoneInfo.textClass}`}
          >
            {zoneInfo.label}
          </span>
          <DrawerTitle>{zone.zoneName}</DrawerTitle>
          <DrawerDescription>Atualizado {formatRelativeTime(zone.lastUpdate)}</DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-6">
          <section className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Chuva</h3>
            {zone.rain === null ? (
              <p className="text-sm text-muted-foreground">Ainda não há leitura de chuva para esta zona.</p>
            ) : (
              <>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRainStatusInfo(zone.rain.status).bgClass} ${getRainStatusInfo(zone.rain.status).textClass}`}
                >
                  {getRainStatusInfo(zone.rain.status).label}
                </span>
                <RainWindowRow label="Última hora" window={zone.rain.lastHour} />
                <RainWindowRow label="Últimas 24h" window={zone.rain.last24Hours} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {zone.rain.stationNames.length > 0
                    ? `Estações do CEMADEN: ${zone.rain.stationNames.join(", ")}`
                    : "Nenhum pluviômetro do CEMADEN reportando nesta zona; valor vindo só da previsão."}
                </p>
              </>
            )}
          </section>

          <section className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Vazão do rio</h3>
            {zone.river === null || zone.river.dischargeCubicMetersPerSecond === null ? (
              <p className="text-sm text-muted-foreground">Ainda não há estimativa de vazão para esta zona.</p>
            ) : (
              <>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiverStatusInfo(zone.river.status).bgClass} ${getRiverStatusInfo(zone.river.status).textClass}`}
                >
                  {getRiverStatusInfo(zone.river.status).label}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hoje:{" "}
                  <span className="font-semibold text-foreground">
                    {zone.river.dischargeCubicMetersPerSecond.toFixed(2)} m³/s
                  </span>
                  {zone.river.forecastPeakCubicMetersPerSecond !== null && (
                    <>
                      {" · "}pico previsto{" "}
                      <span className="font-semibold text-foreground">
                        {zone.river.forecastPeakCubicMetersPerSecond.toFixed(2)} m³/s
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estimativa de modelo global (GloFAS), não leitura de sensor local.
                </p>
              </>
            )}
          </section>

          {zone.tide && (
            <section className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Maré</h3>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {TIDE_STATUS_LABEL[zone.tide.status]}
                </p>
                {zone.tide.nearestExtremeHeightMeters !== null && (
                  <p className="text-sm text-muted-foreground">
                    Nível: <span className="font-semibold text-foreground">{zone.tide.nearestExtremeHeightMeters} m</span>
                  </p>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Última leitura {formatRelativeTime(zone.tide.lastUpdate)}
              </p>
            </section>
          )}

          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Defesa Civil</h3>
            <span
              className={`mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${civilDefenseInfo.bgClass} ${civilDefenseInfo.textClass}`}
            >
              {civilDefenseInfo.label}
            </span>
            {zone.civilDefense.recentAlerts.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Sem avisos recentes da Defesa Civil.</p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {zone.civilDefense.recentAlerts.map((alert) => (
                  <li key={alert} className="text-sm text-foreground">
                    {alert}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
