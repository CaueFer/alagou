import { useEffect, useState } from "react";
import { weatherClient } from "@/api";
import type { AlertLocation } from "@/types/alert";
import type { Weather } from "@/types/weather";

export type WeatherStatus = "idle" | "loading" | "ready" | "error";

export function useWeather(location: AlertLocation | null) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("idle");

  useEffect(() => {
    if (!location) {
      return;
    }

    let cancelled = false;
    setStatus("loading");

    weatherClient
      .getCurrent(location)
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [location?.lat, location?.lng]);

  return { weather, status } as const;
}
