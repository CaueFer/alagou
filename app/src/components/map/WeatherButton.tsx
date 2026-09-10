import { CloudSunIcon, getWeatherIcon } from "@/components/map/icons";
import { FloatingIconButton } from "@/components/ui/floating-icon-button";
import { useWeather } from "@/hooks/useWeather";
import type { AlertLocation } from "@/types/alert";

interface WeatherButtonProps {
  location: AlertLocation | null;
}

export function WeatherButton({ location }: WeatherButtonProps) {
  const { weather, status } = useWeather(location);
  const Icon = status === "ready" && weather ? getWeatherIcon(weather.weatherCode, weather.isDay) : CloudSunIcon;

  return (
    <FloatingIconButton
      size="lg"
      className="absolute left-4 z-[500]"
      style={{ bottom: "var(--bottom-nav-clearance)" }}
      aria-label={status === "ready" && weather ? `Condições climáticas: ${weather.condition}` : "Condições climáticas"}
    >
      <span className="relative flex items-center justify-center">
        <Icon className="absolute -left-2 -top-2 h-6 w-6 text-foreground/55 -rotate-20" />
        <span className="relative top-1 left-1 text-lg font-bold leading-none text-foreground">
          {status === "ready" && weather ? `${Math.round(weather.temperature)}°` : "--°"}
        </span>
      </span>
    </FloatingIconButton>
  );
}
