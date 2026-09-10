import { getDistanceUnit, type DistanceUnit } from "@/lib/settingsPreference";
import type { AlertLocation } from "@/types/alert";

const EARTH_RADIUS_METERS = 6371e3;

export function calculateDistanceMeters(start: AlertLocation, end: AlertLocation): number {
  const phi1 = (start.lat * Math.PI) / 180;
  const phi2 = (end.lat * Math.PI) / 180;
  const deltaPhi = ((end.lat - start.lat) * Math.PI) / 180;
  const deltaLambda = ((end.lng - start.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

export function formatDistance(meters: number, unit?: DistanceUnit): string {
  const activeUnit = unit ?? getDistanceUnit();

  if (activeUnit === "m") {
    return `${Math.round(meters)} m`;
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}
