import { HandDrawnWeatherIcon } from "@/components/map/icons";

interface WeatherData {
  temperature: number;
  condition: string;
}

const mockWeather: WeatherData = {
  temperature: 22,
  condition: "Parcialmente nublado",
};

export function WeatherButton() {
  const weather = mockWeather;

  return (
    <button
      type="button"
      className="absolute left-4 z-[500] flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full border border-white/40 bg-white/80 shadow-lg backdrop-blur-md transition-colors hover:bg-white/90"
      style={{ bottom: "var(--bottom-nav-clearance)" }}
      aria-label="Condições climáticas"
    >
      <HandDrawnWeatherIcon className="h-5 w-5 text-foreground" />
      <span className="text-[10px] font-medium text-foreground">{weather.temperature}°</span>
    </button>
  );
}
