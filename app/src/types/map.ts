import type { AlertLocation } from "@/types/alert";

export interface MapFocus {
  requestId: number;
  location: AlertLocation;
  zoom: number;
}
