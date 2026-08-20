import type { WeatherClient } from "@/api/weatherClient";
import { API_BASE_URL } from "@/lib/constants";
import type { Weather } from "@/types/weather";

export const httpWeatherClient: WeatherClient = {
  async getCurrent(location) {
    const params = new URLSearchParams({ lat: String(location.lat), lng: String(location.lng) });
    const response = await fetch(`${API_BASE_URL}/api/weather?${params}`);
    if (!response.ok) {
      throw new Error(`GET /api/weather failed with status ${response.status}`);
    }
    return (await response.json()) as Weather;
  },
};
