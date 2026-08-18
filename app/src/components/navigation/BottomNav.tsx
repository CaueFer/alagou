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
      className="fixed inset-x-0 bottom-0 z-[600] px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1 rounded-2xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center text-[10px] font-medium leading-tight transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
