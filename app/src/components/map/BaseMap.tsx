import { useEffect } from "react";
import type { ReactNode } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
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

function CompactAttribution() {
  const map = useMap();

  useEffect(() => {
    const control = L.control
      .attribution({ prefix: false, position: "bottomright" })
      .addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OSM</a>')
      .addAttribution('© <a href="https://carto.com/attributions" target="_blank" rel="noopener">CartoDB</a>')
      .addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

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
    <MapContainer
      center={LatLngTuple(center)}
      zoom={zoom}
      zoomControl={false}
      attributionControl={false}
      className={className}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <ZoomControlTopRight />
      <CompactAttribution />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      {children}
    </MapContainer>
  );
}

function ZoomControlTopRight() {
  const map = useMap();

  useEffect(() => {
    const control = L.control.zoom({ position: "topright" });
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}
