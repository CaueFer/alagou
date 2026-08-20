export interface Weather {
  temperature: number;
  condition: string;
  weatherCode: number | null;
  isDay: boolean;
  observedAt: string;
}
