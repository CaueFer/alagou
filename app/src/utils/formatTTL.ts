export function formatTTL(expiresAt: string): string {
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  if (diffMs <= 0) {
    return "Expirado"
  }

  const minutes = Math.round(diffMs / 60_000)
  if (minutes < 1) {
    return "Expira em menos de 1 min"
  }
  return `Expira em ${minutes} min`
}

export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.round(diffMs / 60_000)

  if (minutes < 1) {
    return "Agora mesmo"
  }
  if (minutes < 60) {
    return `Há ${minutes} minuto${minutes === 1 ? "" : "s"}`
  }

  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `Há ${hours} hora${hours === 1 ? "" : "s"}`
  }

  return new Date(isoDate).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}
