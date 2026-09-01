import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav";
import { usePresenceHeartbeat } from "@/hooks/usePresenceHeartbeat";

export function AppLayout() {
  usePresenceHeartbeat();
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Outlet />
      <BottomNav />
    </div>
  );
}
