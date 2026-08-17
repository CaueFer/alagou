import { NavLink } from "react-router-dom";
import { Bell, Camera, MapIcon, ShieldAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavTab {
  to: string;
  label: string;
  icon: typeof MapIcon;
  end?: boolean;
}

const TABS: NavTab[] = [
  { to: "/", label: "Mapa", icon: MapIcon, end: true },
  { to: "/cameras", label: "Câmeras", icon: Camera },
  { to: "/defesa-civil", label: "Defesa Civil", icon: ShieldAlert },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[600] flex justify-center px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div className="flex items-center gap-0.5 rounded-2xl border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[10px] font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
