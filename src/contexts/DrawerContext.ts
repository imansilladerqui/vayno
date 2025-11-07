import { createContext, useContext } from "react";
import type { SpotDetailsDrawerData } from "@/types";

interface UseDrawerReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  show: () => void;
  hide: () => void;
}

interface SpotDetailsDrawerType extends UseDrawerReturn {
  data: SpotDetailsDrawerData | null;
  setData: (data: SpotDetailsDrawerData | null) => void;
}

interface DrawerContextType {
  occupiedDrawer: SpotDetailsDrawerType;
  reservedDrawer: SpotDetailsDrawerType;
  maintenanceDrawer: SpotDetailsDrawerType;
  [key: string]: SpotDetailsDrawerType | UseDrawerReturn | object;
}

export const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawers = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawers must be used within DrawerProvider");
  return ctx;
};
