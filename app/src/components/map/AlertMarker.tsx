import { useMemo } from "react";
import { Marker } from "react-leaflet";
import { createAlertIcon } from "@/components/map/alertIcon";
import type { Alert } from "@/types/alert";

interface AlertMarkerProps {
  alert: Alert;
  onSelect: (id: string) => void;
}

export function AlertMarker({ alert, onSelect }: AlertMarkerProps) {
  const icon = useMemo(
    () => createAlertIcon(alert.severity, alert.confirmationCount),
    [alert.severity, alert.confirmationCount],
  );

  return (
    <Marker
      position={[alert.location.lat, alert.location.lng]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(alert.id) }}
    />
  );
}
