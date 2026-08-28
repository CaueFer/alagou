import { Plus } from "lucide-react";
import { BaseMap } from "@/components/map/BaseMap";
import { AlertMarker } from "@/components/map/AlertMarker";
import { AlertAreaCircle } from "@/components/map/AlertAreaCircle";
import { CameraMarker } from "@/components/map/CameraMarker";
import { RecenterMap } from "@/components/map/RecenterMap";
import { AlertSummaryBar } from "@/components/map/AlertSummaryBar";
import { SeverityLegend } from "@/components/map/SeverityLegend";
import { WeatherButton } from "@/components/map/WeatherButton";
import { ZoneLayer } from "@/components/map/ZoneLayer";
import { ZonesToggleButton } from "@/components/map/ZonesToggleButton";
import { Button } from "@/components/ui/button";
import type { Alert, AlertLocation } from "@/types/alert";
import type { Camera } from "@/types/camera";
import type { Zone } from "@/types/zone";

interface MapViewProps {
  alerts: Alert[];
  cameras: Camera[];
  zones: Zone[];
  zonesVisible: boolean;
  loading: boolean;
  focusLocation: AlertLocation | null;
  userLocation: AlertLocation | null;
  onSelectAlert: (id: string) => void;
  onSelectCamera: (camera: Camera) => void;
  onSelectZone: (zone: Zone) => void;
  onToggleZones: () => void;
  onCreateReport: () => void;
}

export function MapView({
  alerts,
  cameras,
  zones,
  zonesVisible,
  loading,
  focusLocation,
  userLocation,
  onSelectAlert,
  onSelectCamera,
  onSelectZone,
  onToggleZones,
  onCreateReport,
}: MapViewProps) {
  return (
    <div className="relative h-full w-full">
      <BaseMap className="h-full w-full">
        {focusLocation ? (
          <RecenterMap location={focusLocation} zoom={16} />
        ) : (
          userLocation && <RecenterMap location={userLocation} />
        )}
        {zonesVisible && <ZoneLayer zones={zones} onSelectZone={onSelectZone} />}
        {alerts.map((alert) => (
          <AlertAreaCircle key={`area-${alert.id}`} alert={alert} />
        ))}
        {alerts.map((alert) => (
          <AlertMarker key={alert.id} alert={alert} onSelect={onSelectAlert} />
        ))}
        {cameras.map((camera) => (
          <CameraMarker key={camera.id} camera={camera} onSelect={onSelectCamera} />
        ))}
      </BaseMap>

      <AlertSummaryBar alerts={alerts} />
      <SeverityLegend />
      <WeatherButton location={userLocation} />
      <ZonesToggleButton visible={zonesVisible} onToggle={onToggleZones} />

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      )}

      <Button
        size="icon"
        onClick={onCreateReport}
        aria-label="Reportar alagamento"
        className="absolute right-4 z-[500] h-14 w-14 rounded-full border border-white/40 bg-white/80 text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-white/90"
        style={{ bottom: "var(--bottom-nav-clearance)" }}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
