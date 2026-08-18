import { useMemo } from "react";
import { Circle } from "react-leaflet";
import type { AlertLocation } from "@/types/alert";

const RING_FRACTIONS_AND_OPACITY: Array<[fraction: number, opacity: number]> = [
  [1, 0.03],
  [0.9, 0.05],
  [0.8, 0.07],
  [0.7, 0.09],
  [0.6, 0.12],
  [0.5, 0.15],
  [0.4, 0.18],
  [0.3, 0.22],
  [0.2, 0.26],
  [0.1, 0.3],
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
