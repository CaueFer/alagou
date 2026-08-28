import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatRelativeTime } from "@/lib/time";
import { getRiskLevelInfo } from "@/lib/riskLevel";
import { getRiverStatusInfo, getZoneStatusInfo } from "@/lib/zoneStatus";
import type { TideStatus, Zone } from "@/types/zone";

const TIDE_STATUS_LABEL: Record<TideStatus, string> = {
  HIGH_TIDE: "Maré alta",
  LOW_TIDE: "Maré baixa",
  UNKNOWN: "Sem dado",
};

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
            <h3 className="mb-2 text-sm font-semibold text-foreground">Rios</h3>
            {zone.rivers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Esta zona não possui estação de monitoramento de rios.
              </p>
            ) : (
              <ul className="space-y-3">
                {zone.rivers.map((river) => {
                  const riverInfo = getRiverStatusInfo(river.status);
                  return (
                    <li key={river.stationCode}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{river.stationName}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${riverInfo.bgClass} ${riverInfo.textClass}`}
                        >
                          {riverInfo.label}
                        </span>
                      </div>
                      {river.level !== null ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Nível: <span className="font-semibold text-foreground">{river.level} m</span>
                          {" · "}última leitura {formatRelativeTime(river.lastUpdate)}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Ainda não há leitura oficial de nível deste rio.{" "}
                          <span>Última leitura {formatRelativeTime(river.lastUpdate)}</span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {zone.tide && (
            <section className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Maré</h3>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {TIDE_STATUS_LABEL[zone.tide.status]}
                </p>
                {zone.tide.currentLevel !== null && (
                  <p className="text-sm text-muted-foreground">
                    Nível: <span className="font-semibold text-foreground">{zone.tide.currentLevel} m</span>
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
