import type { Severity } from "@/types/alert";

interface SeverityInfo {
  label: string;
  description: string;
  markerColor: string;
  areaRadiusMeters: number;
}

const SEVERITY_INFO: Record<Severity, SeverityInfo> = {
  MODERATE: {
    label: "Moderado",
    description: "Trânsito lento, cuidado ao passar",
    markerColor: "#eab308",
    areaRadiusMeters: 160,
  },
  SEVERE: {
    label: "Grave",
    description: "Via parcialmente bloqueada",
    markerColor: "#f97316",
    areaRadiusMeters: 240,
  },
  CRITICAL: {
    label: "Crítico",
    description: "Via totalmente bloqueada ou risco de vida",
    markerColor: "#dc2626",
    areaRadiusMeters: 320,
  },
};

export function getSeverityInfo(severity: Severity): SeverityInfo {
  return SEVERITY_INFO[severity];
}

export const SEVERITY_ORDER: Severity[] = ["MODERATE", "SEVERE", "CRITICAL"];
