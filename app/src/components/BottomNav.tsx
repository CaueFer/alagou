import { Bell, MapPin, ShieldAlert, User, Video } from "lucide-react"
import { cn } from "@/lib/utils"

export type NavTab = "map" | "cameras" | "civil-defense" | "alerts" | "profile"

interface NavItem {
  id: NavTab
  label: string
  icon: typeof MapPin
}

// Order and labels per dev-docs/fluxos/index.md.
const navItems: NavItem[] = [
  { id: "map", label: "Mapa", icon: MapPin },
  { id: "cameras", label: "Câmeras", icon: Video },
  { id: "civil-defense", label: "Defesa Civil", icon: ShieldAlert },
  { id: "alerts", label: "Alertas", icon: Bell },
  { id: "profile", label: "Perfil", icon: User },
]

interface BottomNavProps {
  active: NavTab
  onChange: (tab: NavTab) => void
  civilDefenseBadgeCount?: number
}

export function BottomNav({ active, onChange, civilDefenseBadgeCount = 0 }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex h-bottom-nav-height border-t border-border bg-surface-container-lowest pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegação principal"
    >
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = id === active
        const showBadge = id === "civil-defense" && civilDefenseBadgeCount > 0

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex min-w-touch-target-min flex-1 flex-col items-center justify-center gap-0.5",
              isActive ? "text-primary" : "text-on-surface-variant"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="relative">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {showBadge && (
                <span className="tnum absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-severity-critical px-1 text-[10px] font-bold text-on-severity-critical">
                  {civilDefenseBadgeCount}
                </span>
              )}
            </span>
            <span className="text-[11px] font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
