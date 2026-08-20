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
      className="absolute left-4 z-[500] flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full border border-white/40 bg-white/80 shadow-lg backdrop-blur-md transition-colors hover:bg-white/90"
      style={{ bottom: "var(--bottom-nav-clearance)" }}
      aria-label={status === "ready" && weather ? `Condições climáticas: ${weather.condition}` : "Condições climáticas"}
    >
      <Icon className="h-5 w-5 text-foreground" />
      <span className="text-[10px] font-medium text-foreground">
        {status === "ready" && weather ? `${Math.round(weather.temperature)}°` : "--°"}
      </span>
    </button>
  );
}
