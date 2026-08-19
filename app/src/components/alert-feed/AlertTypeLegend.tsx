import { ALERT_TYPE_ORDER, getAlertTypeInfo } from "@/lib/alertType";
import { cn } from "@/lib/utils";

export function AlertTypeLegend() {
  return (
    <div className="sticky top-16 z-10 flex justify-center px-4 pb-1 pt-2">
      <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/70 px-4 py-1.5 shadow-lg backdrop-blur-md">
        {ALERT_TYPE_ORDER.map((type) => {
          const info = getAlertTypeInfo(type);
          return (
            <span key={type} className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <span className={cn("h-2 w-2 rounded-full", info.bgClass)} />
              {info.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
