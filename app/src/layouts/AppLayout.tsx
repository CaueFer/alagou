import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav";

export function AppLayout() {
  return (
    <div className="relative h-dvh w-dvw overflow-hidden">
      <Outlet />
      <BottomNav />
    </div>
  );
}
