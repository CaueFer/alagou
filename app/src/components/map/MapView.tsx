import { Plus } from "lucide-react";
import { BaseMap } from "@/components/map/BaseMap";
import { AlertMarker } from "@/components/map/AlertMarker";
import { RecenterMap } from "@/components/map/RecenterMap";
import { Button } from "@/components/ui/button";
import type { Alert, AlertLocation } from "@/types/alert";

interface MapViewProps {
  alerts: Alert[];
  loading: boolean;
  focusLocation: AlertLocation | null;
  onSelectAlert: (id: string) => void;
  onCreateReport: () => void;
}

export function MapView({ alerts, loading, focusLocation, onSelectAlert, onCreateReport }: MapViewProps) {
  return (
    <div className="relative h-full w-full">
      <BaseMap className="h-full w-full">
        {focusLocation && <RecenterMap location={focusLocation} zoom={16} />}
        {alerts.map((alert) => (
          <AlertMarker key={alert.id} alert={alert} onSelect={onSelectAlert} />
        ))}
      </BaseMap>

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="pointer-events-none absolute top-6 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow">
          Nenhum alerta ativo no momento
        </div>
      )}

      <Button
        size="icon"
        onClick={onCreateReport}
        aria-label="Reportar alagamento"
        className="absolute right-4 bottom-6 z-[500] h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
