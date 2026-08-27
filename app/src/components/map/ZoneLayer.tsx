import { Polygon } from "react-leaflet";
import { getZoneStatusInfo } from "@/lib/zoneStatus";
import type { Zone } from "@/types/zone";

interface ZoneLayerProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}

function toLatLngRings(polygon: number[][][]): [number, number][][] {
  return polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng] as [number, number]));
}

export function ZoneLayer({ zones, onSelectZone }: ZoneLayerProps) {
  return (
    <>
      {zones.map((zone) => {
        const info = getZoneStatusInfo(zone.overallStatus);
        return (
          <Polygon
            key={zone.zoneId}
            positions={toLatLngRings(zone.polygon)}
            pathOptions={{
              color: info.color,
              weight: 2,
              fillColor: info.color,
              fillOpacity: 0.16,
            }}
            eventHandlers={{ click: () => onSelectZone(zone) }}
          />
        );
      })}
    </>
  );
}
