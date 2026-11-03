import { NavLink, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Map, Camera, ShieldCheck, Bell, UserRound } from "lucide-react";
import type { ComponentType } from "react";

interface NavTab {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  end?: boolean;
}

const TABS: NavTab[] = [
  { to: "/", label: "Mapa", icon: Map, end: true },
  { to: "/cameras", label: "Câmeras", icon: Camera },
  { to: "/defesa-civil", label: "Civil", icon: ShieldCheck },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/perfil", label: "Perfil", icon: UserRound },
];

function isTabActive(pathname: string, tab: NavTab) {
  return tab.end ? pathname === tab.to : pathname.startsWith(tab.to);
}

export function BottomNav() {
  const location = useLocation();
  const activeIndex = TABS.findIndex((tab) => isTabActive(location.pathname, tab));

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const activeTab = tabRefs.current[activeIndex];
    if (!container || !activeTab) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      setPill({ left: Math.round(tabRect.left - containerRect.left), width: Math.round(tabRect.width) });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[600] px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      <div
        ref={containerRef}
        className="relative mx-auto grid w-full max-w-sm grid-cols-5 gap-1 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-1.5 shadow-[0_4px_16px_0_rgba(11,28,48,0.12)]"
      >
        {pill && (
          <div
            className="absolute left-0 top-1.5 h-14 rounded-xl bg-primary transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
          />
        )}
        {TABS.map((tab, index) => {
          const isActive = index === activeIndex;
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              to={tab.to}
              end={tab.end}
              className={cn(
                "relative z-10 flex h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center text-xs font-semibold leading-none transition-colors duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-[22px] w-[22px] shrink-0" strokeWidth={2} aria-hidden="true" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
