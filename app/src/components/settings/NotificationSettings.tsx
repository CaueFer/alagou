import { useState } from "react";
import { BellOff } from "lucide-react";
import { toast } from "sonner";
import { RadiusSelector } from "@/components/settings/RadiusSelector";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import { cn } from "@/lib/utils";
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

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({ title, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 py-3.5">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex flex-1 flex-col gap-0.5 text-left disabled:cursor-not-allowed"
      >
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </button>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={title} />
    </div>
  );
}

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
    <SettingsSection title="Notificações">
      {permission === "default" && (
        <div className="flex flex-col gap-3 py-3.5">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">Ativar notificações</p>
            <p className="text-sm text-muted-foreground">
              Permita notificações para receber alertas de alagamento perto de você.
            </p>
          </div>
          <Button type="button" onClick={() => void handleRequest()}>
            Ativar notificações
          </Button>
        </div>
      )}

      {permission === "unsupported" && (
        <div className="flex items-start gap-3 py-3.5">
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
        <div className="flex items-start gap-3 py-3.5">
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
        <>
          <div>
            <ToggleRow
              title="Alertas de cidadãos próximos"
              description="Alertas relatados por outros cidadãos nas proximidades."
              checked={nearbyEnabled}
              onChange={handleNearbyChange}
              disabled={togglesDisabled}
            />
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-[250ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                nearbyEnabled ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2 pb-3.5">
                  <p className="text-xs font-medium text-muted-foreground">Raio de alerta</p>
                  <RadiusSelector value={radius} onValueChange={handleRadiusChange} />
                </div>
              </div>
            </div>
          </div>

          <ToggleRow
            title="Alertas climáticos"
            description="Avisos baseados em dados meteorológicos e de rios."
            checked={climaticEnabled}
            onChange={handleClimaticChange}
            disabled={togglesDisabled}
          />

          <ToggleRow
            title="Avisos graves da Defesa Civil"
            description="Avisos oficiais da Defesa Civil de Joinville."
            checked={civilDefenseEnabled}
            onChange={handleCivilDefenseChange}
            disabled={togglesDisabled}
          />
        </>
      )}
    </SettingsSection>
  );
}
