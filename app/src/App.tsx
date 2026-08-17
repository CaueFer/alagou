import { useState } from "react"
import { BottomNav, type NavTab } from "@/components/BottomNav"
import { MapPage } from "@/pages/MapPage"
import { CamerasPage } from "@/pages/CamerasPage"
import { CivilDefensePage } from "@/pages/CivilDefensePage"
import { AlertsPage } from "@/pages/AlertsPage"
import { ProfilePage } from "@/pages/ProfilePage"

const pagesByTab: Record<NavTab, React.ComponentType> = {
  map: MapPage,
  cameras: CamerasPage,
  "civil-defense": CivilDefensePage,
  alerts: AlertsPage,
  profile: ProfilePage,
}

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("map")
  const ActivePage = pagesByTab[activeTab]

  return (
    <>
      <ActivePage />
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </>
  )
}

export default App
