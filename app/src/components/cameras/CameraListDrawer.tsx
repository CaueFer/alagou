import { CameraList } from "@/components/cameras/CameraList";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { Camera } from "@/types/camera";

interface CameraListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cameras: Camera[];
  loading: boolean;
  locked: boolean;
  unavailableIds: Set<string>;
  selectedCameraId: string | null;
  onSelect: (camera: Camera) => void;
}

export function CameraListDrawer({
  open,
  onOpenChange,
  cameras,
  loading,
  locked,
  unavailableIds,
  selectedCameraId,
  onSelect,
}: CameraListDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Câmeras em Tempo Real</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <CameraList
            cameras={cameras}
            locked={locked}
            loading={loading}
            unavailableIds={unavailableIds}
            selectedCameraId={selectedCameraId}
            onSelect={onSelect}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
