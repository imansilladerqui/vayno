import { useDrawers } from "@/contexts/DrawerContext";
import { OccupiedDrawer } from "./OccupiedDrawer";
import { ReservedDrawer } from "./ReservedDrawer";
import { MaintenanceDrawer } from "./MaintenanceDrawer";

const DrawerManager = () => {
  const { occupiedDrawer, reservedDrawer, maintenanceDrawer } = useDrawers();

  return (
    <>
      {occupiedDrawer.data?.spot && (
        <OccupiedDrawer
          open={occupiedDrawer.open}
          onOpenChange={occupiedDrawer.setOpen}
          spot={occupiedDrawer.data.spot}
        />
      )}

      {reservedDrawer.data?.spot && (
        <ReservedDrawer
          open={reservedDrawer.open}
          onOpenChange={reservedDrawer.setOpen}
          spot={reservedDrawer.data.spot}
        />
      )}

      {maintenanceDrawer.data?.spot && (
        <MaintenanceDrawer
          open={maintenanceDrawer.open}
          onOpenChange={maintenanceDrawer.setOpen}
          spot={maintenanceDrawer.data.spot}
        />
      )}
    </>
  );
};

export { DrawerManager };
