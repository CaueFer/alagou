import L from "leaflet";
import { JOINVILLE_CENTER, JOINVILLE_PROXIMITY_RADIUS_METERS } from "@/lib/constants";
import type { AlertLocation } from "@/types/alert";

export function isFarFromJoinville(location: AlertLocation): boolean {
  return L.latLng(location).distanceTo(JOINVILLE_CENTER) > JOINVILLE_PROXIMITY_RADIUS_METERS;
}
