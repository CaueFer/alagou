import axios from "axios"
import type { Alert, NewAlertPayload } from "@/types"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export async function fetchAlerts() {
  const { data } = await api.get<Alert[]>("/api/alertas")
  return data
}

export async function createAlert(payload: NewAlertPayload) {
  const form = new FormData()
  form.append("lat", String(payload.lat))
  form.append("lng", String(payload.lng))
  form.append("severity", payload.severity)
  if (payload.username) {
    form.append("username", payload.username)
  }
  for (const photo of payload.photos) {
    form.append("photos", photo)
  }

  const { data } = await api.post<Alert>("/api/alertas", form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export async function confirmAlert(id: string) {
  const { data } = await api.post<Alert>(`/api/alertas/${id}/confirmar`)
  return data
}

export async function reportClearRoad(id: string) {
  const { data } = await api.post<Alert>(`/api/alertas/${id}/pista-limpa`)
  return data
}
