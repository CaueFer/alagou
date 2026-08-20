import { CloudSunIcon, getWeatherIcon } from "@/components/map/icons";
import { useWeather } from "@/hooks/useWeather";
import type { AlertLocation } from "@/types/alert";

interface WeatherButtonProps {
  location: AlertLocation | null;
}

export function WeatherButton({ location }: WeatherButtonProps) {
  const { weather, status } = useWeather(location);
  const Icon = status === "ready" && weather ? getWeatherIcon(weather.weatherCode, weather.isDay) : CloudSunIcon;

  return (
    <button
      type="button"
      className="absolute left-4 z-[500] flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/80 shadow-lg backdrop-blur-md transition-colors hover:bg-white/90"
      style={{ bottom: "var(--bottom-nav-clearance)" }}
      aria-label={status === "ready" && weather ? `Condições climáticas: ${weather.condition}` : "Condições climáticas"}
    >
      <span className="relative flex items-center justify-center">
        <Icon className="absolute -left-3 -top-3 h-6 w-6 text-foreground/55" />
        <span className="relative top-0.5 left-0.5 text-lg font-bold leading-none text-foreground">
          {status === "ready" && weather ? `${Math.round(weather.temperature)}°` : "--°"}
        </span>
      </span>
    </button>
  );
}
