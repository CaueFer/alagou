import { useEffect, useState } from "react"

export interface GeolocationState {
  lat: number | null
  lng: number | null
  loading: boolean
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({
        lat: null,
        lng: null,
        loading: false,
        error: "Geolocalização não suportada neste dispositivo.",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
        })
      },
      () => {
        setState({
          lat: null,
          lng: null,
          loading: false,
          error: "Não foi possível obter sua localização.",
        })
      }
    )
  }, [])

  return state
}
