import { createContext, useContext } from "react";
import type { ParkingSpotData } from "@/types";

interface UseModalReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  show: () => void;
  hide: () => void;
}

interface ModalWithData<T> extends UseModalReturn {
  data: T | null;
  setData: (data: T | null) => void;
}

type ModalContextValue = {
  checkInModal: ModalWithData<ParkingSpotData>;
  reservationModal: ModalWithData<ParkingSpotData>;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModals = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModals must be used within ModalProvider");
  return ctx;
};
