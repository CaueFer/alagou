import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { getSeverityInfo } from "@/lib/severity";
import { formatTimeRemaining } from "@/lib/ttl";
import type { Alert } from "@/types/alert";

const TTL_REFRESH_INTERVAL_MS = 30_000;

interface AlertDetailSheetProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
  onReportClear: (id: string) => Promise<void>;
  pendingAction: "confirm" | "clear" | null;
}

export function AlertDetailSheet({
  alert,
  open,
  onOpenChange,
  onConfirm,
  onReportClear,
  pendingAction,
}: AlertDetailSheetProps) {
  const { address, loading: loadingAddress } = useReverseGeocode(alert?.location ?? null);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => forceTick((tick) => tick + 1), TTL_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [open]);

  if (!alert) {
    return null;
  }

  const severityInfo = getSeverityInfo(alert.severity);
  const isBusy = pendingAction !== null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: severityInfo.markerColor }}
            >
              {severityInfo.label}
            </span>
            <Badge variant="outline">{formatTimeRemaining(alert.expiresAt)}</Badge>
          </div>
          <DrawerTitle>{loadingAddress ? "Localizando..." : (address ?? "Local não identificado")}</DrawerTitle>
          <DrawerDescription>
            {alert.confirmationCount === 1 ? "1 confirmação" : `${alert.confirmationCount} confirmações`}
            {alert.username ? ` · relatado por ${alert.username}` : " · relatado anonimamente"}
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <Button onClick={() => onConfirm(alert.id)} disabled={isBusy}>
            {pendingAction === "confirm" ? "Confirmando..." : "Confirmar"}
          </Button>
          <Button variant="outline" onClick={() => onReportClear(alert.id)} disabled={isBusy}>
            {pendingAction === "clear" ? "Enviando..." : "Pista Limpa"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
