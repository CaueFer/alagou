import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav";

export function AppLayout() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Outlet />
      <BottomNav />
    </div>
  );
}
