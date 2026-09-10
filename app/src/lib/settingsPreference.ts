import { useSyncExternalStore } from "react";

export type NotificationRadiusKm = 1 | 3 | 5 | 10;
export type MapType = "standard" | "satellite";
export type DistanceUnit = "km" | "m";

export const NOTIFICATION_RADIUS_KM_OPTIONS: NotificationRadiusKm[] = [1, 3, 5, 10];
export const DEFAULT_NOTIFICATION_RADIUS_KM: NotificationRadiusKm = 5;

const NEARBY_ALERTS_ENABLED_KEY = "alagou.settings.notifications.nearbyAlertsEnabled";
const CLIMATIC_ALERTS_ENABLED_KEY = "alagou.settings.notifications.climaticAlertsEnabled";
const CIVIL_DEFENSE_ALERTS_ENABLED_KEY = "alagou.settings.notifications.civilDefenseAlertsEnabled";
const NOTIFICATION_RADIUS_KM_KEY = "alagou.settings.notifications.radiusKm";
const MAP_TYPE_KEY = "alagou.settings.display.mapType";
const DISTANCE_UNIT_KEY = "alagou.settings.display.distanceUnit";

export function getNearbyAlertsEnabled(): boolean {
  return localStorage.getItem(NEARBY_ALERTS_ENABLED_KEY) !== "false";
}

export function setNearbyAlertsEnabled(enabled: boolean): void {
  localStorage.setItem(NEARBY_ALERTS_ENABLED_KEY, String(enabled));
}

export function getClimaticAlertsEnabled(): boolean {
  return localStorage.getItem(CLIMATIC_ALERTS_ENABLED_KEY) !== "false";
}

export function setClimaticAlertsEnabled(enabled: boolean): void {
  localStorage.setItem(CLIMATIC_ALERTS_ENABLED_KEY, String(enabled));
}

export function getCivilDefenseAlertsEnabled(): boolean {
  return localStorage.getItem(CIVIL_DEFENSE_ALERTS_ENABLED_KEY) !== "false";
}

export function setCivilDefenseAlertsEnabled(enabled: boolean): void {
  localStorage.setItem(CIVIL_DEFENSE_ALERTS_ENABLED_KEY, String(enabled));
}

export function getNotificationRadiusKm(): NotificationRadiusKm {
  const raw = localStorage.getItem(NOTIFICATION_RADIUS_KM_KEY);
  const parsed = raw !== null ? Number(raw) : DEFAULT_NOTIFICATION_RADIUS_KM;
  if ((NOTIFICATION_RADIUS_KM_OPTIONS as number[]).includes(parsed)) {
    return parsed as NotificationRadiusKm;
  }
  return DEFAULT_NOTIFICATION_RADIUS_KM;
}

export function setNotificationRadiusKm(radius: NotificationRadiusKm): void {
  localStorage.setItem(NOTIFICATION_RADIUS_KM_KEY, String(radius));
}

export function getMapType(): MapType {
  return localStorage.getItem(MAP_TYPE_KEY) === "satellite" ? "satellite" : "standard";
}

export function setMapType(mapType: MapType): void {
  localStorage.setItem(MAP_TYPE_KEY, mapType);
  window.dispatchEvent(new Event("alagou:map-type-change"));
}

function subscribeMapType(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("alagou:map-type-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("alagou:map-type-change", callback);
  };
}

export function useMapType(): MapType {
  return useSyncExternalStore(subscribeMapType, getMapType, () => "standard");
}

export function getDistanceUnit(): DistanceUnit {
  return localStorage.getItem(DISTANCE_UNIT_KEY) === "m" ? "m" : "km";
}

export function setDistanceUnit(unit: DistanceUnit): void {
  localStorage.setItem(DISTANCE_UNIT_KEY, unit);
  window.dispatchEvent(new Event("alagou:distance-unit-change"));
}

function subscribeDistanceUnit(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("alagou:distance-unit-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("alagou:distance-unit-change", callback);
  };
}

export function useDistanceUnit(): DistanceUnit {
  return useSyncExternalStore(subscribeDistanceUnit, getDistanceUnit, () => "km");
}