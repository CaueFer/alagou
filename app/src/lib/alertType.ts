import { CloudRain, ShieldAlert, Users } from "lucide-react";
import type { ComponentType } from "react";
import type { RecentAlertType } from "@/types/recentAlert";

interface AlertTypeInfo {
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  bgClass: string;
  textClass: string;
  containerBgClass: string;
  containerTextClass: string;
  borderClass: string;
}

const ALERT_TYPE_INFO: Record<RecentAlertType, AlertTypeInfo> = {
  USER: {
    label: "Cidadãos",
    icon: Users,
    bgClass: "bg-alert-user",
    textClass: "text-on-alert-user",
    containerBgClass: "bg-alert-user-container",
    containerTextClass: "text-on-alert-user-container",
    borderClass: "border-alert-user",
  },
  CLIMATIC: {
    label: "Climático",
    icon: CloudRain,
    bgClass: "bg-alert-climatic",
    textClass: "text-on-alert-climatic",
    containerBgClass: "bg-alert-climatic-container",
    containerTextClass: "text-on-alert-climatic-container",
    borderClass: "border-alert-climatic",
  },
  CIVIL_DEFENSE: {
    label: "Defesa Civil",
    icon: ShieldAlert,
    bgClass: "bg-alert-civil-defense",
    textClass: "text-on-alert-civil-defense",
    containerBgClass: "bg-alert-civil-defense-container",
    containerTextClass: "text-on-alert-civil-defense-container",
    borderClass: "border-alert-civil-defense",
  },
};

export function getAlertTypeInfo(type: RecentAlertType): AlertTypeInfo {
  return ALERT_TYPE_INFO[type];
}

export const ALERT_TYPE_ORDER: RecentAlertType[] = ["USER", "CLIMATIC", "CIVIL_DEFENSE"];
