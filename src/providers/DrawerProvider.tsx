import { useState } from "react";
import type { SpotDetailsDrawerData } from "@/types";
import { useDialog } from "@/hooks/useDialog";
import { DrawerContext } from "@/contexts/DrawerContext";

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const occupiedDrawerDialog = useDialog();
  const [occupiedDrawerData, setOccupiedDrawerData] =
    useState<SpotDetailsDrawerData | null>(null);

  const reservedDrawerDialog = useDialog();
  const [reservedDrawerData, setReservedDrawerData] =
    useState<SpotDetailsDrawerData | null>(null);

  const maintenanceDrawerDialog = useDialog();
  const [maintenanceDrawerData, setMaintenanceDrawerData] =
    useState<SpotDetailsDrawerData | null>(null);

  const occupiedDrawer = {
    ...occupiedDrawerDialog,
    data: occupiedDrawerData,
    setData: setOccupiedDrawerData,
  };

  const reservedDrawer = {
    ...reservedDrawerDialog,
    data: reservedDrawerData,
    setData: setReservedDrawerData,
  };

  const maintenanceDrawer = {
    ...maintenanceDrawerDialog,
    data: maintenanceDrawerData,
    setData: setMaintenanceDrawerData,
  };

  return (
    <DrawerContext.Provider
      value={{
        occupiedDrawer,
        reservedDrawer,
        maintenanceDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
