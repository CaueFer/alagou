import L from "leaflet";
import { getSeverityInfo } from "@/lib/severity";
import type { Severity } from "@/types/alert";

const PIN_SIZE = 40;

export function createAlertIcon(severity: Severity, confirmationCount: number): L.DivIcon {
  const color = getSeverityInfo(severity).markerColor;
  const badge =
    confirmationCount > 0
      ? `<span class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-foreground px-1 text-[10px] font-bold leading-none text-white">${confirmationCount}</span>`
      : "";

  return L.divIcon({
    className: "",
    html: `
      <div class="relative" style="width:${PIN_SIZE}px;height:${PIN_SIZE}px">
        <svg width="${PIN_SIZE}" height="${PIN_SIZE}" viewBox="0 0 40 40" fill="none">
          <path d="M20 2C11.16 2 4 9.16 4 18c0 11 16 20 16 20s16-9 16-20c0-8.84-7.16-16-16-16z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="20" cy="18" r="6" fill="white"/>
        </svg>
        ${badge}
      </div>
    `,
    iconSize: [PIN_SIZE, PIN_SIZE],
    iconAnchor: [PIN_SIZE / 2, PIN_SIZE],
    popupAnchor: [0, -PIN_SIZE],
  });
}

export function createDraggablePinIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="width:${PIN_SIZE}px;height:${PIN_SIZE}px">
        <svg width="${PIN_SIZE}" height="${PIN_SIZE}" viewBox="0 0 40 40" fill="none">
          <path d="M20 2C11.16 2 4 9.16 4 18c0 11 16 20 16 20s16-9 16-20c0-8.84-7.16-16-16-16z" fill="var(--color-primary)" stroke="white" stroke-width="2"/>
          <circle cx="20" cy="18" r="6" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [PIN_SIZE, PIN_SIZE],
    iconAnchor: [PIN_SIZE / 2, PIN_SIZE],
  });
}
