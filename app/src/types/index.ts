export type Severity = "MODERADO" | "GRAVE" | "CRITICO"

export interface Alert {
  id: string
  lat: number
  lng: number
  severity: Severity
  confirmations: number
  expiresAt: string
  active: boolean
}

export interface NewAlertPayload {
  lat: number
  lng: number
  severity: Severity
  username?: string
  photos: File[]
}

export type RiskLevel = "ATENCAO" | "ALERTA" | "EMERGENCIA"

export interface CivilDefenseNotice {
  id: string
  title: string
  riskLevel: RiskLevel
  issuedAt: string
  issuingBody: string
  body: string
  coverageArea?: string
  instructions?: string
}

export interface Camera {
  id: string
  name: string
  embedUrl: string
  live: boolean
}

export type FeedAlertType = "CROWDSOURCE" | "CLIMATIC" | "CIVIL_DEFENSE"

export interface FeedAlert {
  id: string
  type: FeedAlertType
  location: string
  issuedAt: string
  summary: string
}

export type MapType = "STANDARD" | "SATELLITE"
export type DistanceUnit = "KM" | "M"
export type NotificationRadiusKm = 1 | 3 | 5 | 10

export interface NotificationSettings {
  nearbyCrowdsourceAlerts: boolean
  nearbyAlertsRadiusKm: NotificationRadiusKm
  climaticAlerts: boolean
  civilDefenseEmergencyAlerts: boolean
}

export interface DisplaySettings {
  mapType: MapType
  distanceUnit: DistanceUnit
}
