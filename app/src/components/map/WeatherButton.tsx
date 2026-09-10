import { CloudSunIcon, getWeatherIcon, getWeatherIconColor } from "@/components/map/icons";
import { glassSurfaceClass } from "@/components/ui/floating-icon-button";
import { useWeather } from "@/hooks/useWeather";
import { cn } from "@/lib/utils";
import type { AlertLocation } from "@/types/alert";

interface WeatherButtonProps {
  location: AlertLocation | null;
}

export function WeatherButton({ location }: WeatherButtonProps) {
  const { weather, status } = useWeather(location);
  const ready = status === "ready" && weather !== null;
  const Icon = ready ? getWeatherIcon(weather.weatherCode, weather.isDay) : CloudSunIcon;
  const iconColor = ready ? getWeatherIconColor(weather.weatherCode, weather.isDay) : "text-muted-foreground";

  return (
    <div
      role="status"
      aria-label={
        ready
          ? `Clima: ${weather.condition}, ${Math.round(weather.temperature)} graus`
          : "Clima indisponível"
      }
      className={cn(
        "absolute left-4 z-[500] flex h-9 items-center gap-1.5 rounded-full pl-2 pr-3",
        glassSurfaceClass,
      )}
      style={{ bottom: "var(--bottom-nav-clearance)" }}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", iconColor)} />
      <span className="text-sm font-semibold leading-none tracking-tight tabular-nums text-foreground">
        {ready ? `${Math.round(weather.temperature)}°` : "--°"}
      </span>
    </div>
  );
}
