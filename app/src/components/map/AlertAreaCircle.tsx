import { useMemo } from "react";
import { Circle } from "react-leaflet";
import { getSeverityInfo } from "@/lib/severity";
import type { Alert } from "@/types/alert";

const RING_FRACTIONS_AND_OPACITY: Array<[fraction: number, opacity: number]> = [
  [1, 0.05],
  [0.75, 0.08],
  [0.52, 0.13],
  [0.3, 0.2],
  [0.13, 0.3],
];

interface AlertAreaCircleProps {
  alert: Alert;
}

export function AlertAreaCircle({ alert }: AlertAreaCircleProps) {
  const { markerColor, areaRadiusMeters } = getSeverityInfo(alert.severity);
  const center: [number, number] = [alert.location.lat, alert.location.lng];

  const rings = useMemo(
    () => RING_FRACTIONS_AND_OPACITY.map(([fraction, opacity]) => ({ radius: areaRadiusMeters * fraction, opacity })),
    [areaRadiusMeters],
  );

  return (
    <>
      {rings.map((ring) => (
        <Circle
          key={ring.radius}
          center={center}
          radius={ring.radius}
          pathOptions={{
            stroke: false,
            fill: true,
            fillColor: markerColor,
            fillOpacity: ring.opacity,
            interactive: false,
          }}
        />
      ))}
    </>
  );
}
