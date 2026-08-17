import type { ReactNode } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_ZOOM, JOINVILLE_CENTER } from "@/lib/constants";
import type { AlertLocation } from "@/types/alert";

interface BaseMapProps {
  center?: AlertLocation;
  zoom?: number;
  children?: ReactNode;
  onMapClick?: (location: AlertLocation) => void;
  className?: string;
}

function LatLngTuple(location: AlertLocation): [number, number] {
  return [location.lat, location.lng];
}

function MapClickHandler({ onMapClick }: { onMapClick: (location: AlertLocation) => void }) {
  useMapEvents({
    click: (event) => onMapClick({ lat: event.latlng.lat, lng: event.latlng.lng }),
  });
  return null;
}

export function BaseMap({
  center = JOINVILLE_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  children,
  onMapClick,
  className,
}: BaseMapProps) {
  return (
    <MapContainer center={LatLngTuple(center)} zoom={zoom} zoomControl={false} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      {children}
    </MapContainer>
  );
}
