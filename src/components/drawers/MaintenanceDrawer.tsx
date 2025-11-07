import { SpotDetailsDrawer } from "@/components/drawers/SpotDetailsDrawer";
import type { ParkingSpotWithBusiness } from "@/types";

interface MaintenanceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot: ParkingSpotWithBusiness;
}

export const MaintenanceDrawer = ({
  open,
  onOpenChange,
  spot,
}: MaintenanceDrawerProps) => {
  return (
    <SpotDetailsDrawer open={open} onOpenChange={onOpenChange} spot={spot}>
      <div className="p-4 text-muted-foreground">
        This spot is currently under maintenance.
      </div>
    </SpotDetailsDrawer>
  );
};
