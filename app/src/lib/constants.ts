import type { AlertLocation } from "@/types/alert";

export const JOINVILLE_CENTER: AlertLocation = { lat: -26.3044, lng: -48.8456 };
export const DEFAULT_MAP_ZOOM = 14;

const DEFAULT_API_PORT = "8080";

function isLoopbackHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (typeof window === "undefined") {
    return configured ?? `http://localhost:${DEFAULT_API_PORT}`;
  }

  const pageHost = window.location.hostname;

  if (configured) {
    if (isLoopbackHost(pageHost)) {
      return configured;
    }
    try {
      const url = new URL(configured);
      if (isLoopbackHost(url.hostname)) {
        url.hostname = pageHost;
        return url.toString().replace(/\/$/, "");
      }
      return configured;
    } catch {
      return configured;
    }
  }

  return `${window.location.protocol}//${pageHost}:${DEFAULT_API_PORT}`;
}

export const API_BASE_URL = resolveApiBaseUrl();
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export const MAP_STYLE_LIGHT_URL =
  import.meta.env.VITE_MAP_STYLE_LIGHT_URL ?? "https://tiles.openfreemap.org/styles/positron";
