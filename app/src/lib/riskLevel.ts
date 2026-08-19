import type { RiskLevel } from "@/types/civilDefense";

interface RiskLevelInfo {
  label: string;
  bgClass: string;
  textClass: string;
  containerBgClass: string;
  containerTextClass: string;
}

const RISK_LEVEL_INFO: Record<RiskLevel, RiskLevelInfo> = {
  ATTENTION: {
    label: "Atenção",
    bgClass: "bg-severity-moderate",
    textClass: "text-on-severity-moderate",
    containerBgClass: "bg-severity-moderate-container",
    containerTextClass: "text-on-severity-moderate-container",
  },
  ALERT: {
    label: "Alerta",
    bgClass: "bg-severity-severe",
    textClass: "text-on-severity-severe",
    containerBgClass: "bg-severity-severe-container",
    containerTextClass: "text-on-severity-severe-container",
  },
  EMERGENCY: {
    label: "Emergência",
    bgClass: "bg-severity-critical",
    textClass: "text-on-severity-critical",
    containerBgClass: "bg-severity-critical-container",
    containerTextClass: "text-on-severity-critical-container",
  },
};

export function getRiskLevelInfo(level: RiskLevel): RiskLevelInfo {
  return RISK_LEVEL_INFO[level];
}
