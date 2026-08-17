import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SeveritySelector } from "@/components/SeveritySelector"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useCreateAlert } from "@/hooks/useAlertActions"
import type { Severity } from "@/types"

interface NewReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewReportModal({ open, onOpenChange }: NewReportModalProps) {
  const { lat, lng, loading: locating, error: locationError } = useGeolocation()
  const [severity, setSeverity] = useState<Severity | null>(null)
  const [username, setUsername] = useState("")
  const createAlert = useCreateAlert()

  function handleSubmit() {
    if (!lat || !lng || !severity) {
      return
    }
    createAlert.mutate(
      { lat, lng, severity, username: username || undefined, photos: [] },
      {
        onSuccess: () => {
          onOpenChange(false)
          setSeverity(null)
          setUsername("")
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl">
        <SheetHeader>
          <SheetTitle className="text-title-md">Reportar alagamento</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <p className="text-body-sm text-on-surface-variant">
            {locating
              ? "Capturando sua localização..."
              : (locationError ?? "Localização capturada.")}
          </p>

          <input
            className="h-touch-target-min rounded border border-border bg-surface-container-lowest px-3 text-body-lg"
            placeholder="Seu nome (opcional)"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <SeveritySelector value={severity} onChange={setSeverity} />

          {/* Captura de fotos (Fluxo 1.2, Passo 3) requer acesso à câmera
              nativa do dispositivo — fica para uma iteração seguinte. */}

          {createAlert.isError && (
            <p className="text-body-sm text-severity-critical">
              Não foi possível enviar o relato. Tente novamente.
            </p>
          )}
        </div>

        <SheetFooter>
          <Button
            disabled={!lat || !lng || !severity || createAlert.isPending}
            onClick={handleSubmit}
          >
            Reportar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
