import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  HandDrawnMapIcon,
  HandDrawnCameraIcon,
  HandDrawnShieldIcon,
  HandDrawnBellIcon,
  HandDrawnUserIcon,
} from "@/components/navigation/icons";
import type { ComponentType } from "react";

interface NavTab {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
}

const TABS: NavTab[] = [
  { to: "/", label: "Mapa", icon: HandDrawnMapIcon, end: true },
  { to: "/cameras", label: "Câmeras", icon: HandDrawnCameraIcon },
  { to: "/defesa-civil", label: "Defesa Civil", icon: HandDrawnShieldIcon },
  { to: "/alertas", label: "Alertas", icon: HandDrawnBellIcon },
  { to: "/perfil", label: "Perfil", icon: HandDrawnUserIcon },
];

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[600] px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      <div className="mx-auto grid w-full max-w-sm grid-cols-5 gap-1 rounded-2xl border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center text-[10px] font-medium leading-tight transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
