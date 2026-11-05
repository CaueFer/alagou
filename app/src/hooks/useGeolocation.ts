import { useCallback, useEffect, useState } from "react";
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

  const refresh = useCallback(
    () =>
      new Promise<AlertLocation | null>((resolve) => {
        if (!("geolocation" in navigator)) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Geolocalização não suportada neste dispositivo. Toque no mapa para posicionar manualmente.",
          }));
          resolve(null);
          return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = { lat: position.coords.latitude, lng: position.coords.longitude };
            setState({ position: location, loading: false, error: null });
            resolve(location);
          },
          () => {
            setState((prev) => ({
              ...prev,
              loading: false,
              error: "Não foi possível obter sua localização. Toque no mapa para posicionar manualmente.",
            }));
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10_000 },
        );
      }),
    [],
  );

  useEffect(() => {
    if (enabled) {
      void refresh();
    }
  }, [enabled, refresh]);

  return { ...state, refresh };
}
