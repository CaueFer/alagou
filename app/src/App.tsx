import { Toaster } from "sonner";
import { MapScreen } from "@/screens/MapScreen";

function App() {
  return (
    <>
      <MapScreen />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
