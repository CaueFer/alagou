import type { AlertLocation } from "@/types/alert";
import type { Weather } from "@/types/weather";

export interface WeatherClient {
  getCurrent(location: AlertLocation): Promise<Weather>;
}
