import L from "leaflet";

const ICON_SIZE = 32;
const TOUCH_TARGET_SIZE = 40;

export function createCameraIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="width:${TOUCH_TARGET_SIZE}px;height:${TOUCH_TARGET_SIZE}px;border-radius:12px;background:#1e293b;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25));cursor:pointer">
        <svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="10" width="18" height="14" rx="3" fill="white"/>
          <path d="M22 14l6-3v12l-6-3z" fill="white"/>
          <circle cx="13" cy="17" r="4" fill="#334155"/>
          <circle cx="13" cy="17" r="1.5" fill="white"/>
          <rect x="8" y="7" width="4" height="3" rx="1" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [TOUCH_TARGET_SIZE, TOUCH_TARGET_SIZE],
    iconAnchor: [TOUCH_TARGET_SIZE / 2, TOUCH_TARGET_SIZE / 2],
    popupAnchor: [0, -TOUCH_TARGET_SIZE / 2],
  });
}
