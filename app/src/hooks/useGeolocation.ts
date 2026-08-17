import { useEffect, useState } from "react";
import type { AlertLocation } from "@/types/alert";

interface GeolocationState {
  position: AlertLocation | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(enabled: boolean) {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: enabled,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!("geolocation" in navigator)) {
      setState({
        position: null,
        loading: false,
        error: "Geolocalização não suportada neste dispositivo. Toque no mapa para posicionar manualmente.",
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: { lat: position.coords.latitude, lng: position.coords.longitude },
          loading: false,
          error: null,
        });
      },
      () => {
        setState({
          position: null,
          loading: false,
          error: "Não foi possível obter sua localização. Toque no mapa para posicionar manualmente.",
        });
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, [enabled]);

  return state;
}
