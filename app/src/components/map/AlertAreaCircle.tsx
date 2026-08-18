import { AreaGradientCircle } from "@/components/map/AreaGradientCircle";
import { getSeverityInfo } from "@/lib/severity";
import type { Alert } from "@/types/alert";

interface AlertAreaCircleProps {
  alert: Alert;
}

export function AlertAreaCircle({ alert }: AlertAreaCircleProps) {
  const { markerColor, areaRadiusMeters } = getSeverityInfo(alert.severity);

  return <AreaGradientCircle center={alert.location} color={markerColor} radiusMeters={areaRadiusMeters} />;
}
