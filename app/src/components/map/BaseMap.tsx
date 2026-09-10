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

import { useMapType } from "@/lib/settingsPreference";

function CompactAttribution({ isSatellite }: { isSatellite: boolean }) {
  const map = useMap();

  useEffect(() => {
    const control = L.control.attribution({ prefix: false, position: "bottomright" });
    if (isSatellite) {
      control.addAttribution('© <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a>');
    } else {
      control
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OSM</a>')
        .addAttribution('© <a href="https://carto.com/attributions" target="_blank" rel="noopener">CartoDB</a>');
    }
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map, isSatellite]);

  return null;
}

export function BaseMap({
  center = JOINVILLE_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  children,
  onMapClick,
  className,
}: BaseMapProps) {
  const mapType = useMapType();
  const isSatellite = mapType === "satellite";

  return (
    <MapContainer
      center={LatLngTuple(center)}
      zoom={zoom}
      zoomControl={false}
      attributionControl={false}
      className={className}
    >
      {isSatellite ? (
        <TileLayer
          key="satellite"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
      ) : (
        <TileLayer
          key="standard"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
      )}
      <ZoomControlTopRight />
      <CompactAttribution isSatellite={isSatellite} />
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
