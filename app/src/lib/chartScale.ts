const NICE_STEPS = [1, 2, 5];

export interface AxisScale {
  max: number;
  ticks: number[];
}

export function buildAxisScale(largestValue: number): AxisScale {
  let magnitude = 1;
  let stepIndex = 0;
  while (largestValue > NICE_STEPS[stepIndex] * magnitude * 4) {
    stepIndex += 1;
    if (stepIndex === NICE_STEPS.length) {
      stepIndex = 0;
      magnitude *= 10;
    }
  }
  const step = NICE_STEPS[stepIndex] * magnitude;
  return { max: step * 4, ticks: [0, step * 2, step * 4] };
}

export function parseCalendarDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatShortDate(value: string): string {
  return parseCalendarDate(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function formatLongDate(value: string): string {
  return parseCalendarDate(value).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
}

export function pluralizeAlerts(count: number): string {
  return `${count} ${count === 1 ? "alerta" : "alertas"}`;
}
