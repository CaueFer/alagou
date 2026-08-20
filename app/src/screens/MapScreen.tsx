import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MapView } from "@/components/map/MapView";
import { AlertDetailSheet } from "@/components/alert-detail/AlertDetailSheet";
import { NewReportFlow } from "@/components/new-report/NewReportFlow";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { useAlerts } from "@/hooks/useAlerts";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { alertClient, cameraClient } from "@/api";
import type { AlertLocation } from "@/types/alert";
import type { Camera } from "@/types/camera";

export function MapScreen() {
  const { alerts, status, updateAlert, removeAlert, addAlert } = useAlerts();
  const { confirm, reportClear, pendingAction } = useConfirmation();
  const { position } = useGeolocation(true);

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [focusLocation, setFocusLocation] = useState<AlertLocation | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const fetchCameras = useCallback(async () => {
    try {
      const data = await cameraClient.list();
      setCameras(data);
    } catch {
      toast.error("Falha ao carregar cameras.");
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  useEffect(() => {
    if (status === "error") {
      toast.error("Falha ao atualizar alertas. Exibindo dados salvos.");
    }
  }, [status]);

  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) ?? null;

  async function handleConfirm(id: string) {
    const updated = await confirm(id);
    updateAlert(updated);
  }

  async function handleReportClear(id: string) {
    const result = await reportClear(id);
    if (result.removed) {
      removeAlert(id);
      setSelectedAlertId(null);
    } else if (result.alert) {
      updateAlert(result.alert);
    }
  }

  return (
    <div className="h-full w-full">
      <MapView
        alerts={alerts}
        cameras={cameras}
        loading={status === "loading"}
        focusLocation={focusLocation}
        userLocation={position}
        onSelectAlert={setSelectedAlertId}
        onSelectCamera={setSelectedCamera}
        onCreateReport={() => setIsCreatingReport(true)}
      />

      <CameraPlayer
        camera={selectedCamera}
        loading={false}
        fullscreen
        onClose={() => setSelectedCamera(null)}
      />

      <AlertDetailSheet
        alert={selectedAlert}
        open={selectedAlertId !== null}
        onOpenChange={(open) => !open && setSelectedAlertId(null)}
        onConfirm={handleConfirm}
        onReportClear={handleReportClear}
        pendingAction={pendingAction}
      />

      <NewReportFlow
        open={isCreatingReport}
        onOpenChange={setIsCreatingReport}
        onSubmit={(input) => alertClient.create(input)}
        onCreated={(alert) => {
          addAlert(alert);
          setFocusLocation(alert.location);
          toast.success("Relato enviado com sucesso.");
        }}
      />
    </div>
  );
}
