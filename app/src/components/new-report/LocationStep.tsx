import { useEffect } from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { BaseMap } from "@/components/map/BaseMap";
import { RecenterMap } from "@/components/map/RecenterMap";
import { createDraggablePinIcon } from "@/components/map/alertIcon";
import { useGeolocation } from "@/hooks/useGeolocation";
import { JOINVILLE_CENTER } from "@/lib/constants";
import type { AlertLocation } from "@/types/alert";

interface LocationStepProps {
  location: AlertLocation | null;
  onChangeLocation: (location: AlertLocation) => void;
}

const pinIcon = createDraggablePinIcon();

export function LocationStep({ location, onChangeLocation }: LocationStepProps) {
  const { position, loading, error } = useGeolocation(location === null);

  useEffect(() => {
    if (position && location === null) {
      onChangeLocation(position);
    }
  }, [position, location, onChangeLocation]);

  const pin = location ?? position;

  return (
    <div className="flex h-full flex-col">
      <p className="px-4 pb-3 text-sm text-muted-foreground">
        {loading && "Obtendo sua localização..."}
        {!loading && error && error}
        {!loading && !error && "Arraste o marcador para ajustar o ponto exato do alagamento."}
      </p>
      <div className="h-72 w-full overflow-hidden">
        <BaseMap
          center={pin ?? JOINVILLE_CENTER}
          zoom={17}
          className="h-full w-full"
          onMapClick={onChangeLocation}
        >
          {pin && <RecenterMap location={pin} />}
          {pin && (
            <Marker
              position={[pin.lat, pin.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker: L.Marker = event.target;
                  const latLng = marker.getLatLng();
                  onChangeLocation({ lat: latLng.lat, lng: latLng.lng });
                },
              }}
            />
          )}
        </BaseMap>
      </div>
    </div>
  );
}
