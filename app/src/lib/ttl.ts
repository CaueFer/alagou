export function formatTimeRemaining(expiresAt: string, now: Date = new Date()): string {
  const remainingMs = new Date(expiresAt).getTime() - now.getTime();
  if (remainingMs <= 0) {
    return "Expirado";
  }

  const remainingMinutes = Math.round(remainingMs / 60_000);
  if (remainingMinutes < 1) {
    return "Expira em menos de 1 min";
  }
  if (remainingMinutes < 60) {
    return `Expira em ${remainingMinutes} min`;
  }

  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  return `Expira em ${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
}
