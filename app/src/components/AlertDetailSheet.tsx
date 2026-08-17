import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SeverityBadge } from "@/components/SeverityBadge"
import { useConfirmAlert, useReportClearRoad } from "@/hooks/useAlertActions"
import { formatTTL } from "@/utils/formatTTL"
import type { Alert } from "@/types"

interface AlertDetailSheetProps {
  alert: Alert | null
  onOpenChange: (open: boolean) => void
}

export function AlertDetailSheet({ alert, onOpenChange }: AlertDetailSheetProps) {
  const confirmAlert = useConfirmAlert()
  const reportClearRoad = useReportClearRoad()

  const pending = confirmAlert.isPending || reportClearRoad.isPending

  return (
    <Sheet open={alert !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl">
        {alert && (
          <>
            <SheetHeader>
              <SheetTitle className="text-title-md">
                {/* Reverse-geocoded address goes here once geocoding is wired
                    up — never show raw lat/lng, per app/CLAUDE.md. */}
                Ponto reportado nas proximidades
              </SheetTitle>
            </SheetHeader>

            <div className="flex items-center gap-3 px-4">
              <SeverityBadge severity={alert.severity} />
              <span className="tnum text-body-sm text-on-surface-variant">
                {formatTTL(alert.expiresAt)}
              </span>
              <span className="tnum text-body-sm text-on-surface-variant">
                {alert.confirmations} confirmação{alert.confirmations === 1 ? "" : "ões"}
              </span>
            </div>

            <SheetFooter className="flex-row gap-2">
              <Button
                className="flex-1"
                disabled={pending}
                onClick={() => confirmAlert.mutate(alert.id)}
              >
                Confirmar
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={pending}
                onClick={() => reportClearRoad.mutate(alert.id)}
              >
                Pista Limpa
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
