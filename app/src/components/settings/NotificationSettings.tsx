import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { RadiusSelector } from "@/components/settings/RadiusSelector";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import type { PushFlags } from "@/types/push";
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
  const { syncEnabled, disableAll } = usePushSubscription();
  const [nearbyEnabled, setNearbyEnabled] = useState(() => getNearbyAlertsEnabled());
  const [climaticEnabled, setClimaticEnabled] = useState(() => getClimaticAlertsEnabled());
  const [civilDefenseEnabled, setCivilDefenseEnabled] = useState(() => getCivilDefenseAlertsEnabled());
  const [radius, setRadius] = useState<NotificationRadiusKm>(() => getNotificationRadiusKm());

  const togglesDisabled = permission !== "granted";

  async function syncServer(flags: PushFlags) {
    try {
      if (flags.nearbyEnabled || flags.climaticEnabled || flags.civilDefenseEnabled) {
        await syncEnabled(flags);
      } else {
        await disableAll();
      }
    } catch {
      toast.error("Não foi possível atualizar as notificações.");
    }
  }

  async function handleRequest() {
    const result = await request();
    if (result === "granted") {
      void syncServer({ nearbyEnabled, climaticEnabled, civilDefenseEnabled });
    }
  }

  function handleNearbyChange(enabled: boolean) {
    setNearbyEnabled(enabled);
    setNearbyAlertsEnabled(enabled);
    void syncServer({ nearbyEnabled: enabled, climaticEnabled, civilDefenseEnabled });
  }

  function handleClimaticChange(enabled: boolean) {
    setClimaticEnabled(enabled);
    setClimaticAlertsEnabled(enabled);
    void syncServer({ nearbyEnabled, climaticEnabled: enabled, civilDefenseEnabled });
  }

  function handleCivilDefenseChange(enabled: boolean) {
    setCivilDefenseEnabled(enabled);
    setCivilDefenseAlertsEnabled(enabled);
    void syncServer({ nearbyEnabled, climaticEnabled, civilDefenseEnabled: enabled });
  }

  function handleRadiusChange(value: NotificationRadiusKm) {
    setRadius(value);
    setNotificationRadiusKm(value);
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Notificações</h2>

      <div className="flex flex-col">
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
            <Button type="button" onClick={() => void handleRequest()}>
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