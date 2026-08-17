import type { Severity } from "@/types/alert";

interface SeverityInfo {
  label: string;
  description: string;
  markerColor: string;
}

const SEVERITY_INFO: Record<Severity, SeverityInfo> = {
  MODERATE: {
    label: "Moderado",
    description: "Trânsito lento, cuidado ao passar",
    markerColor: "#eab308",
  },
  SEVERE: {
    label: "Grave",
    description: "Via parcialmente bloqueada",
    markerColor: "#f97316",
  },
  CRITICAL: {
    label: "Crítico",
    description: "Via totalmente bloqueada ou risco de vida",
    markerColor: "#dc2626",
  },
};

export function getSeverityInfo(severity: Severity): SeverityInfo {
  return SEVERITY_INFO[severity];
}

export const SEVERITY_ORDER: Severity[] = ["MODERATE", "SEVERE", "CRITICAL"];
