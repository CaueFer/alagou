const ZONES_VISIBLE_STORAGE_KEY = "alagou.zones.visible";

export function getZonesVisible(): boolean {
  return localStorage.getItem(ZONES_VISIBLE_STORAGE_KEY) !== "false";
}

export function setZonesVisible(visible: boolean): void {
  localStorage.setItem(ZONES_VISIBLE_STORAGE_KEY, String(visible));
}
