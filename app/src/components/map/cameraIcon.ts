import L from "leaflet";

const ICON_SIZE = 32;

export function createCameraIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="width:${ICON_SIZE}px;height:${ICON_SIZE}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
        <svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="10" width="18" height="14" rx="3" fill="#1e293b" stroke="white" stroke-width="1.5"/>
          <path d="M22 14l6-3v12l-6-3z" fill="#1e293b" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="13" cy="17" r="4" fill="#334155" stroke="white" stroke-width="1"/>
          <circle cx="13" cy="17" r="1.5" fill="white"/>
          <rect x="8" y="7" width="4" height="3" rx="1" fill="#1e293b" stroke="white" stroke-width="1"/>
        </svg>
      </div>
    `,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, -ICON_SIZE / 2],
  });
}
