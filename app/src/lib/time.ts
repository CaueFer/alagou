export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const elapsedMs = now.getTime() - new Date(isoDate).getTime();
  if (elapsedMs < 60_000) {
    return "Agora mesmo";
  }

  const elapsedMinutes = Math.floor(elapsedMs / 60_000);
  if (elapsedMinutes < 60) {
    return elapsedMinutes === 1 ? "Há 1 minuto" : `Há ${elapsedMinutes} minutos`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return elapsedHours === 1 ? "Há 1 hora" : `Há ${elapsedHours} horas`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return elapsedDays === 1 ? "Há 1 dia" : `Há ${elapsedDays} dias`;
}

export function formatFullTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
