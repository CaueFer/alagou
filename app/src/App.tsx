import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/layouts/AppLayout";
import { MapScreen } from "@/screens/MapScreen";
import { CamerasScreen } from "@/screens/CamerasScreen";
import { CivilDefenseScreen } from "@/screens/CivilDefenseScreen";
import { RecentAlertsScreen } from "@/screens/RecentAlertsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<MapScreen />} />
          <Route path="cameras" element={<CamerasScreen />} />
          <Route path="defesa-civil" element={<CivilDefenseScreen />} />
          <Route path="alertas" element={<RecentAlertsScreen />} />
          <Route path="perfil" element={<ProfileScreen />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
