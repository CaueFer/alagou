import { Polygon } from "react-leaflet";
import { getZoneStatusInfo } from "@/lib/zoneStatus";
import type { Zone } from "@/types/zone";

interface ZoneLayerProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}

function toLatLngRings(rings: number[][][]): [number, number][][] {
  return rings.map((ring) => ring.map(([lng, lat]) => [lat, lng] as [number, number]));
}

export function ZoneLayer({ zones, onSelectZone }: ZoneLayerProps) {
  return (
    <>
      {zones.flatMap((zone) =>
        zone.polygon.map((rings, polygonIndex) => {
          const info = getZoneStatusInfo(zone.overallStatus);
          return (
            <Polygon
              key={`${zone.zoneId}-${polygonIndex}`}
              positions={toLatLngRings(rings)}
              pathOptions={{
                color: info.color,
                weight: 2,
                fillColor: info.color,
                fillOpacity: 0.16,
              }}
              eventHandlers={{ click: () => onSelectZone(zone) }}
            />
          );
        })
      )}
    </>
  );
}
