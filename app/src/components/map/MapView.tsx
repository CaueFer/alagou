import { Plus } from "lucide-react";
import { BaseMap } from "@/components/map/BaseMap";
import { AlertMarker } from "@/components/map/AlertMarker";
import { AlertAreaCircle } from "@/components/map/AlertAreaCircle";
import { CameraMarker } from "@/components/map/CameraMarker";
import { FarFromJoinvilleAlert } from "@/components/map/FarFromJoinvilleAlert";
import { LocateButton } from "@/components/map/LocateButton";
import { RecenterMap } from "@/components/map/RecenterMap";
import { AlertSummaryBar } from "@/components/map/AlertSummaryBar";
import { MapOptionsButton } from "@/components/map/MapOptionsButton";
import { WeatherButton } from "@/components/map/WeatherButton";
import { ZoneLayer } from "@/components/map/ZoneLayer";
import { FloatingIconButton } from "@/components/ui/floating-icon-button";
import type { Alert, AlertLocation } from "@/types/alert";
import type { Camera } from "@/types/camera";
import type { MapFocus } from "@/types/map";
import type { Zone } from "@/types/zone";

interface MapViewProps {
  alerts: Alert[];
  cameras: Camera[];
  zones: Zone[];
  zonesVisible: boolean;
  loading: boolean;
  mapFocus: MapFocus | null;
  userLocation: AlertLocation | null;
  locating: boolean;
  showFarAlert: boolean;
  onSelectAlert: (id: string) => void;
  onSelectCamera: (camera: Camera) => void;
  onSelectZone: (zone: Zone) => void;
  onToggleZones: () => void;
  onCreateReport: () => void;
  onLocateUser: () => void;
  onGoToJoinville: () => void;
  onDismissFarAlert: () => void;
}

export function MapView({
  alerts,
  cameras,
  zones,
  zonesVisible,
  loading,
  mapFocus,
  userLocation,
  locating,
  showFarAlert,
  onSelectAlert,
  onSelectCamera,
  onSelectZone,
  onToggleZones,
  onCreateReport,
  onLocateUser,
  onGoToJoinville,
  onDismissFarAlert,
}: MapViewProps) {
  return (
    <div className="relative h-full w-full">
      <BaseMap className="h-full w-full">
        {mapFocus ? (
          <RecenterMap key={mapFocus.requestId} location={mapFocus.location} zoom={mapFocus.zoom} />
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

      {showFarAlert && (
        <FarFromJoinvilleAlert onGoToJoinville={onGoToJoinville} onDismiss={onDismissFarAlert} />
      )}
      <AlertSummaryBar alerts={alerts} />
      <WeatherButton location={userLocation} />
      <MapOptionsButton zonesVisible={zonesVisible} onToggleZones={onToggleZones} />

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      )}

      <LocateButton locating={locating} onLocate={onLocateUser} />

      <FloatingIconButton
        size="lg"
        onClick={onCreateReport}
        aria-label="Reportar alagamento"
        className="absolute right-4 z-[500] text-foreground"
        style={{ bottom: "var(--bottom-nav-clearance)" }}
      >
        <Plus className="h-6 w-6" />
      </FloatingIconButton>
    </div>
  );
}
