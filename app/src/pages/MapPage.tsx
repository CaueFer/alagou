import { useState } from "react"
import { Plus } from "lucide-react"
import { Map, MapControls } from "@/components/ui/map"
import { Button } from "@/components/ui/button"
import { AlertMarker } from "@/components/AlertMarker"
import { AlertDetailSheet } from "@/components/AlertDetailSheet"
import { NewReportModal } from "@/components/NewReportModal"
import { useAlerts } from "@/hooks/useAlerts"
import type { Alert } from "@/types"

// lng, lat — Joinville, SC, per app/CLAUDE.md.
const JOINVILLE_CENTER: [number, number] = [-48.8456, -26.3044]

export function MapPage() {
  const { data: alerts, isLoading, isError } = useAlerts()
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <div className="relative h-dvh w-full">
      <Map
        center={JOINVILLE_CENTER}
        zoom={13}
        loading={isLoading}
        className="h-full w-full"
      >
        <MapControls />
        {alerts?.map((alert) => (
          <AlertMarker key={alert.id} alert={alert} onClick={setSelectedAlert} />
        ))}
      </Map>

      {!isLoading && alerts?.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
          <span className="rounded bg-surface-container-lowest px-3 py-1.5 text-body-sm text-on-surface-variant shadow-sm">
            Nenhum alerta ativo no momento
          </span>
        </div>
      )}

      {isError && (
        <div className="absolute inset-x-0 top-4 flex justify-center px-4">
          <span className="rounded bg-offline-banner px-3 py-1.5 text-body-sm text-on-offline-banner shadow-sm">
            Sem conexão. Exibindo dados salvos, se disponíveis.
          </span>
        </div>
      )}

      <Button
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+80px)] right-4 size-fab-size rounded-full shadow-lg"
        onClick={() => setReportOpen(true)}
        aria-label="Reportar alagamento"
      >
        <Plus />
      </Button>

      <AlertDetailSheet
        alert={selectedAlert}
        onOpenChange={(open) => !open && setSelectedAlert(null)}
      />
      <NewReportModal open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  )
}
