import { MapMarker, MarkerContent } from "@/components/ui/map"
import { cn } from "@/lib/utils"
import { severityColor } from "@/utils/severityColor"
import type { Alert } from "@/types"

interface AlertMarkerProps {
  alert: Alert
  onClick: (alert: Alert) => void
}

// Pin shape per design.md "Shapes": rounded top housing the severity icon
// and confirmation count, sharp bottom point for precise geolocation.
export function AlertMarker({ alert, onClick }: AlertMarkerProps) {
  const { bg, text } = severityColor(alert.severity)

  return (
    <MapMarker
      longitude={alert.lng}
      latitude={alert.lat}
      onClick={() => onClick(alert)}
    >
      <MarkerContent className="size-touch-target-min items-center justify-center">
        <div
          className={cn(
            "relative flex size-map-marker-size items-center justify-center rounded-t-full rounded-bl-full text-numeric-data",
            bg,
            text
          )}
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)" }}
        >
          <span className="tnum text-[11px] font-bold leading-none">
            {alert.confirmations}
          </span>
        </div>
      </MarkerContent>
    </MapMarker>
  )
}
