import { useState } from "react";
import type { ParkingSpotData } from "@/types";
import { useDialog } from "@/hooks/useDialog";
import { ModalContext } from "@/contexts/ModalContext";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const checkInModalDialog = useDialog();
  const reservationModalDialog = useDialog();
  const [checkInModalData, setCheckInModalData] =
    useState<ParkingSpotData | null>(null);
  const [reservationModalData, setReservationModalData] =
    useState<ParkingSpotData | null>(null);

  const checkInModal = {
    ...checkInModalDialog,
    data: checkInModalData,
    setData: setCheckInModalData,
  };

  const reservationModal = {
    ...reservationModalDialog,
    data: reservationModalData,
    setData: setReservationModalData,
  };

  return (
    <ModalContext.Provider
      value={{
        checkInModal,
        reservationModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
