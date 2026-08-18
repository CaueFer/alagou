import { Plus } from "lucide-react";
import { BaseMap } from "@/components/map/BaseMap";
import { AlertMarker } from "@/components/map/AlertMarker";
import { AlertAreaCircle } from "@/components/map/AlertAreaCircle";
import { RecenterMap } from "@/components/map/RecenterMap";
import { AlertSummaryBar } from "@/components/map/AlertSummaryBar";
import { SeverityLegend } from "@/components/map/SeverityLegend";
import { WeatherButton } from "@/components/map/WeatherButton";
import { Button } from "@/components/ui/button";
import type { Alert, AlertLocation } from "@/types/alert";

interface MapViewProps {
  alerts: Alert[];
  loading: boolean;
  focusLocation: AlertLocation | null;
  userLocation: AlertLocation | null;
  onSelectAlert: (id: string) => void;
  onCreateReport: () => void;
}

export function MapView({ alerts, loading, focusLocation, userLocation, onSelectAlert, onCreateReport }: MapViewProps) {
  return (
    <div className="relative h-full w-full">
      <BaseMap className="h-full w-full" center={userLocation ?? undefined}>
        {focusLocation && <RecenterMap location={focusLocation} zoom={16} />}
        {alerts.map((alert) => (
          <AlertAreaCircle key={`area-${alert.id}`} alert={alert} />
        ))}
        {alerts.map((alert) => (
          <AlertMarker key={alert.id} alert={alert} onSelect={onSelectAlert} />
        ))}
      </BaseMap>

      <AlertSummaryBar alerts={alerts} />
      <SeverityLegend />
      <WeatherButton />

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
