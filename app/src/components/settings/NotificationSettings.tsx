import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { RadiusSelector } from "@/components/settings/RadiusSelector";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import {
  getCivilDefenseAlertsEnabled,
  getClimaticAlertsEnabled,
  getNearbyAlertsEnabled,
  getNotificationRadiusKm,
  setCivilDefenseAlertsEnabled,
  setClimaticAlertsEnabled,
  setNearbyAlertsEnabled,
  setNotificationRadiusKm,
  type NotificationRadiusKm,
} from "@/lib/settingsPreference";

export function NotificationSettings() {
  const { permission, request } = useNotificationPermission();
  const [nearbyEnabled, setNearbyEnabled] = useState(() => getNearbyAlertsEnabled());
  const [climaticEnabled, setClimaticEnabled] = useState(() => getClimaticAlertsEnabled());
  const [civilDefenseEnabled, setCivilDefenseEnabled] = useState(() => getCivilDefenseAlertsEnabled());
  const [radius, setRadius] = useState<NotificationRadiusKm>(() => getNotificationRadiusKm());

  const togglesDisabled = permission !== "granted";

  function handleNearbyChange(enabled: boolean) {
    setNearbyEnabled(enabled);
    setNearbyAlertsEnabled(enabled);
  }

  function handleClimaticChange(enabled: boolean) {
    setClimaticEnabled(enabled);
    setClimaticAlertsEnabled(enabled);
  }

  function handleCivilDefenseChange(enabled: boolean) {
    setCivilDefenseEnabled(enabled);
    setCivilDefenseAlertsEnabled(enabled);
  }

  function handleRadiusChange(value: NotificationRadiusKm) {
    setRadius(value);
    setNotificationRadiusKm(value);
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Notificações</h2>

      <div className="rounded-lg border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
        {permission === "default" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">Ativar notificações</p>
                <p className="text-sm text-muted-foreground">
                  Permita notificações para receber alertas de alagamento perto de você.
                </p>
              </div>
            </div>
            <Button type="button" onClick={() => void request()}>
              Ativar notificações
            </Button>
          </div>
        )}

        {permission === "unsupported" && (
          <div className="flex items-start gap-3">
            <BellOff className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">Notificações indisponíveis</p>
              <p className="text-sm text-muted-foreground">
                Este dispositivo não oferece suporte a notificações.
              </p>
            </div>
          </div>
        )}

        {permission === "denied" && (
          <div className="mb-3 flex items-start gap-3 border-b border-border pb-3">
            <BellOff className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">Notificações bloqueadas</p>
              <p className="text-sm text-muted-foreground">
                Ative as notificações do Alagou nas configurações do sistema para receber alertas.
              </p>
            </div>
          </div>
        )}

        {(permission === "granted" || permission === "denied") && (
          <div className="flex flex-col">
            <div className="flex min-h-12 items-center justify-between gap-3 border-b border-border py-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">Alertas de cidadãos próximos</p>
                <p className="text-sm text-muted-foreground">Alertas relatados por outros cidadãos nas proximidades.</p>
              </div>
              <Switch checked={nearbyEnabled} onCheckedChange={handleNearbyChange} disabled={togglesDisabled} aria-label="Alertas de cidadãos próximos" />
            </div>

            {nearbyEnabled && (
              <div className="flex flex-col gap-2 border-b border-border py-3">
                <p className="text-xs font-medium text-muted-foreground">Raio de alerta</p>
                <RadiusSelector value={radius} onValueChange={handleRadiusChange} />
              </div>
            )}

            <div className="flex min-h-12 items-center justify-between gap-3 border-b border-border py-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">Alertas climáticos</p>
                <p className="text-sm text-muted-foreground">Avisos baseados em dados meteorológicos e de rios.</p>
              </div>
              <Switch checked={climaticEnabled} onCheckedChange={handleClimaticChange} disabled={togglesDisabled} aria-label="Alertas climáticos" />
            </div>

            <div className="flex min-h-12 items-center justify-between gap-3 py-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">Avisos graves da Defesa Civil</p>
                <p className="text-sm text-muted-foreground">Avisos oficiais da Defesa Civil de Joinville.</p>
              </div>
              <Switch checked={civilDefenseEnabled} onCheckedChange={handleCivilDefenseChange} disabled={togglesDisabled} aria-label="Avisos graves da Defesa Civil" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}