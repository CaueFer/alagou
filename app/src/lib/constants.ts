import type { AlertLocation } from "@/types/alert";

export const JOINVILLE_CENTER: AlertLocation = { lat: -26.3044, lng: -48.8456 };
export const DEFAULT_MAP_ZOOM = 14;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
