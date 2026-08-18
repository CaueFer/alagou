import { useMemo } from "react";
import { Circle } from "react-leaflet";
import type { AlertLocation } from "@/types/alert";

const RING_FRACTIONS_AND_OPACITY: Array<[fraction: number, opacity: number]> = [
  [1, 0.05],
  [0.75, 0.08],
  [0.52, 0.13],
  [0.3, 0.2],
  [0.13, 0.3],
];

interface AreaGradientCircleProps {
  center: AlertLocation;
  color: string;
  radiusMeters: number;
}

export function AreaGradientCircle({ center, color, radiusMeters }: AreaGradientCircleProps) {
  const position: [number, number] = [center.lat, center.lng];

  const rings = useMemo(
    () => RING_FRACTIONS_AND_OPACITY.map(([fraction, opacity]) => ({ radius: radiusMeters * fraction, opacity })),
    [radiusMeters],
  );

  return (
    <>
      {rings.map((ring) => (
        <Circle
          key={ring.radius}
          center={position}
          radius={ring.radius}
          pathOptions={{
            stroke: false,
            fill: true,
            fillColor: color,
            fillOpacity: ring.opacity,
            interactive: false,
          }}
        />
      ))}
    </>
  );
}
