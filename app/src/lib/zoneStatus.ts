import type { RainStatus, RiverStatus, ZoneStatus } from "@/types/zone";

interface ZoneStatusInfo {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  containerBgClass: string;
  containerTextClass: string;
}

const ZONE_STATUS_INFO: Record<ZoneStatus, ZoneStatusInfo> = {
  NORMAL: {
    label: "Normal",
    color: "#16a34a",
    bgClass: "bg-status-safe",
    textClass: "text-on-status-safe",
    containerBgClass: "bg-status-safe-container",
    containerTextClass: "text-on-status-safe-container",
  },
  ATTENTION: {
    label: "Atenção",
    color: "#eab308",
    bgClass: "bg-severity-moderate",
    textClass: "text-on-severity-moderate",
    containerBgClass: "bg-severity-moderate-container",
    containerTextClass: "text-on-severity-moderate-container",
  },
  ALERT: {
    label: "Alerta",
    color: "#f97316",
    bgClass: "bg-severity-severe",
    textClass: "text-on-severity-severe",
    containerBgClass: "bg-severity-severe-container",
    containerTextClass: "text-on-severity-severe-container",
  },
  CRITICAL: {
    label: "Crítico",
    color: "#ba1a1a",
    bgClass: "bg-severity-critical",
    textClass: "text-on-severity-critical",
    containerBgClass: "bg-severity-critical-container",
    containerTextClass: "text-on-severity-critical-container",
  },
  UNKNOWN: {
    label: "Sem dado",
    color: "#45464d",
    bgClass: "bg-offline-banner",
    textClass: "text-offline-banner-foreground",
    containerBgClass: "bg-border",
    containerTextClass: "text-muted-foreground",
  },
};

export function getZoneStatusInfo(status: ZoneStatus): ZoneStatusInfo {
  return ZONE_STATUS_INFO[status];
}

interface RiverStatusInfo {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
}

const RIVER_STATUS_INFO: Record<RiverStatus, RiverStatusInfo> = {
  NORMAL: {
    label: "Normal",
    color: "#16a34a",
    bgClass: "bg-status-safe",
    textClass: "text-on-status-safe",
  },
  ATTENTION: {
    label: "Atenção",
    color: "#eab308",
    bgClass: "bg-severity-moderate",
    textClass: "text-on-severity-moderate",
  },
  ALERT: {
    label: "Alerta",
    color: "#f97316",
    bgClass: "bg-severity-severe",
    textClass: "text-on-severity-severe",
  },
  UNKNOWN: {
    label: "Sem dado",
    color: "#45464d",
    bgClass: "bg-offline-banner",
    textClass: "text-offline-banner-foreground",
  },
};

export function getRiverStatusInfo(status: RiverStatus): RiverStatusInfo {
  return RIVER_STATUS_INFO[status];
}

export function getRainStatusInfo(status: RainStatus): ZoneStatusInfo {
  return ZONE_STATUS_INFO[status];
}
