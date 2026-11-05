import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { MapView } from "@/components/map/MapView";
import { AlertDetailSheet } from "@/components/alert-detail/AlertDetailSheet";
import { NewReportFlow } from "@/components/new-report/NewReportFlow";
import { CameraPlayer } from "@/components/cameras/CameraPlayer";
import { ZoneDetailSheet } from "@/components/map/ZoneDetailSheet";
import { useAlerts } from "@/hooks/useAlerts";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useZones } from "@/hooks/useZones";
import { alertClient, cameraClient } from "@/api";
import { DEFAULT_MAP_ZOOM, FOCUSED_MAP_ZOOM, JOINVILLE_CENTER } from "@/lib/constants";
import { isFarFromJoinville } from "@/lib/geo";
import { getZonesVisible, setZonesVisible } from "@/lib/zonePreference";
import type { AlertLocation } from "@/types/alert";
import type { Camera } from "@/types/camera";
import type { MapFocus } from "@/types/map";
import type { Zone } from "@/types/zone";

export function MapScreen() {
  const routerLocation = useLocation();
  const { alerts, status, updateAlert, removeAlert, addAlert } = useAlerts();
  const { confirm, reportClear, pendingAction } = useConfirmation();
  const { position, loading: locating, refresh: refreshPosition } = useGeolocation(true);
  const { zones, status: zonesStatus } = useZones();

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [isCreatingReport, setIsCreatingReport] = useState(() => {
    const state = routerLocation.state as { createReport?: boolean } | null;
    return Boolean(state?.createReport);
  });
  const [mapFocus, setMapFocus] = useState<MapFocus | null>(null);
  const lastFocusRequestId = useRef(0);
  const [farAlertDismissed, setFarAlertDismissed] = useState(false);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zonesVisible, setZonesVisibleState] = useState<boolean>(() => getZonesVisible());

  const focusMap = useCallback((location: AlertLocation, zoom: number) => {
    lastFocusRequestId.current += 1;
    setMapFocus({ requestId: lastFocusRequestId.current, location, zoom });
  }, []);

  useEffect(() => {
    const state = routerLocation.state as { focusLocation?: AlertLocation; createReport?: boolean } | null;
    if (state?.focusLocation) {
      focusMap(state.focusLocation, FOCUSED_MAP_ZOOM);
    }
    if (state?.createReport) {
      setIsCreatingReport(true);
    }
  }, [routerLocation.state, focusMap]);

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

  useEffect(() => {
    if (zonesStatus === "error") {
      toast.error("Falha ao carregar zonas de risco.");
    }
  }, [zonesStatus]);

  function handleToggleZones() {
    setZonesVisibleState((visible) => {
      const next = !visible;
      setZonesVisible(next);
      return next;
    });
  }

  async function handleLocateUser() {
    const location = await refreshPosition();
    if (!location) {
      toast.error("Não foi possível obter sua localização. Verifique a permissão de localização do dispositivo.");
      return;
    }
    focusMap(location, FOCUSED_MAP_ZOOM);
    setFarAlertDismissed(false);
  }

  function handleGoToJoinville() {
    focusMap(JOINVILLE_CENTER, DEFAULT_MAP_ZOOM);
    setFarAlertDismissed(true);
  }

  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) ?? null;
  const showFarAlert = position !== null && isFarFromJoinville(position) && !farAlertDismissed;

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
        zones={zones}
        zonesVisible={zonesVisible}
        loading={status === "loading"}
        mapFocus={mapFocus}
        userLocation={position}
        locating={locating}
        showFarAlert={showFarAlert}
        onSelectAlert={setSelectedAlertId}
        onSelectCamera={setSelectedCamera}
        onSelectZone={setSelectedZone}
        onToggleZones={handleToggleZones}
        onCreateReport={() => setIsCreatingReport(true)}
        onLocateUser={handleLocateUser}
        onGoToJoinville={handleGoToJoinville}
        onDismissFarAlert={() => setFarAlertDismissed(true)}
      />

      <CameraPlayer
        camera={selectedCamera}
        loading={false}
        fullscreen
        onClose={() => setSelectedCamera(null)}
      />

      <ZoneDetailSheet
        zone={selectedZone}
        open={selectedZone !== null}
        onOpenChange={(open) => !open && setSelectedZone(null)}
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
          focusMap(alert.location, FOCUSED_MAP_ZOOM);
          toast.success("Relato enviado com sucesso.");
        }}
      />
    </div>
  );
}
