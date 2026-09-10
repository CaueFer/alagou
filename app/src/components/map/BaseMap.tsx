import { useEffect } from "react";
import type { ReactNode } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";
import { DEFAULT_MAP_ZOOM, JOINVILLE_CENTER, MAP_STYLE_LIGHT_URL } from "@/lib/constants";
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

function VectorTileLayer({ styleUrl }: { styleUrl: string }) {
  const map = useMap();

  useEffect(() => {
    const layer = L.maplibreGL({ style: styleUrl, attributionControl: false });
    layer.addTo(map);
    return () => {
      layer.remove();
    };
  }, [map, styleUrl]);

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
        .addAttribution('© <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a>')
        .addAttribution('<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a>');
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
        <VectorTileLayer key="standard" styleUrl={MAP_STYLE_LIGHT_URL} />
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
