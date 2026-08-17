import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { AlertLocation } from "@/types/alert";

export function RecenterMap({ location, zoom }: { location: AlertLocation; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([location.lat, location.lng], zoom ?? map.getZoom());
  }, [location.lat, location.lng, map, zoom]);

  return null;
}
