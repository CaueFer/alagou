import type { FeedAlertType, RiskLevel, Severity } from "@/types"

interface ColorTokens {
  bg: string
  text: string
  containerBg: string
  containerText: string
  label: string
}

const severityTokens: Record<Severity, ColorTokens> = {
  MODERADO: {
    bg: "bg-severity-moderate",
    text: "text-on-severity-moderate",
    containerBg: "bg-severity-moderate-container",
    containerText: "text-on-severity-moderate-container",
    label: "Moderado",
  },
  GRAVE: {
    bg: "bg-severity-severe",
    text: "text-on-severity-severe",
    containerBg: "bg-severity-severe-container",
    containerText: "text-on-severity-severe-container",
    label: "Grave",
  },
  CRITICO: {
    bg: "bg-severity-critical",
    text: "text-on-severity-critical",
    containerBg: "bg-severity-critical-container",
    containerText: "text-on-severity-critical-container",
    label: "Crítico",
  },
}

export function severityColor(severity: Severity): ColorTokens {
  return severityTokens[severity]
}

// Fluxo 3 (Defesa Civil) reuses the map's severity scale under different
// labels — same three-tier meaning, see design.md "Severity scale".
const riskLevelToSeverity: Record<RiskLevel, Severity> = {
  ATENCAO: "MODERADO",
  ALERTA: "GRAVE",
  EMERGENCIA: "CRITICO",
}

const riskLevelLabels: Record<RiskLevel, string> = {
  ATENCAO: "Atenção",
  ALERTA: "Alerta",
  EMERGENCIA: "Emergência",
}

export function riskLevelColor(riskLevel: RiskLevel): ColorTokens {
  return {
    ...severityTokens[riskLevelToSeverity[riskLevel]],
    label: riskLevelLabels[riskLevel],
  }
}

const feedAlertTypeTokens: Record<
  FeedAlertType,
  { bg: string; text: string; label: string }
> = {
  CROWDSOURCE: {
    bg: "bg-alert-crowdsource",
    text: "text-on-alert-crowdsource",
    label: "Cidadãos",
  },
  CLIMATIC: {
    bg: "bg-alert-climatic",
    text: "text-on-alert-climatic",
    label: "Climático",
  },
  CIVIL_DEFENSE: {
    bg: "bg-alert-civil-defense",
    text: "text-on-alert-civil-defense",
    label: "Defesa Civil",
  },
}

export function feedAlertTypeColor(type: FeedAlertType) {
  return feedAlertTypeTokens[type]
}
