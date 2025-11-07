import { useMemo, useCallback } from "react";
import type { ParkingSpotWithBusiness } from "@/types";
import { PARKING_STATUS, getSpotHourlyRate, cn } from "@/lib/utils";
import { useDrawers } from "@/contexts/DrawerContext";
import { useModals } from "@/contexts/ModalContext";

interface UseParkingSpotButtonProps {
  spot: ParkingSpotWithBusiness;
}

interface UseParkingSpotButtonReturn {
  buttonClassName: string;
  spotNumber: string;
  handleViewDetails: () => void;
  handleReserveSpot: () => void;
  handleCheckInSpot: () => void;
}

export const useParkingSpotButton = ({
  spot,
}: UseParkingSpotButtonProps): UseParkingSpotButtonReturn => {
  const { occupiedDrawer, reservedDrawer, maintenanceDrawer } = useDrawers();
  const { checkInModal, reservationModal } = useModals();

  const effectiveStatus = useMemo(() => {
    return spot.status || PARKING_STATUS.AVAILABLE;
  }, [spot.status]);

  const handleReserveSpot = useCallback(() => {
    reservationModal.setData({
      spot_id: spot.id,
      parking_spots: {
        id: spot.id,
        spot_number: spot.spot_number,
        hourly_rate: getSpotHourlyRate(spot),
      },
    });
    reservationModal.show();
  }, [spot, reservationModal]);

  const handleCheckInSpot = useCallback(() => {
    checkInModal.setData({
      spot_id: spot.id,
      parking_spots: {
        id: spot.id,
        spot_number: spot.spot_number,
        hourly_rate: getSpotHourlyRate(spot),
      },
    });
    checkInModal.show();
  }, [spot, checkInModal]);

  const handleViewDetails = useCallback(() => {
    switch (effectiveStatus) {
      case PARKING_STATUS.OCCUPIED:
        occupiedDrawer.setData({ spot });
        occupiedDrawer.show();
        break;
      case PARKING_STATUS.RESERVED:
        reservedDrawer.setData({ spot });
        reservedDrawer.show();
        break;
      case PARKING_STATUS.MAINTENANCE:
        maintenanceDrawer.setData({ spot });
        maintenanceDrawer.show();
        break;
      case PARKING_STATUS.AVAILABLE:
      default:
        break;
    }
  }, [
    spot,
    effectiveStatus,
    occupiedDrawer,
    reservedDrawer,
    maintenanceDrawer,
  ]);

  const statusStyles = useMemo(
    () => ({
      [PARKING_STATUS.AVAILABLE]:
        "bg-success/20 border-success text-success-foreground hover:bg-success/30",
      [PARKING_STATUS.OCCUPIED]:
        "bg-destructive/20 border-destructive text-destructive-foreground",
      [PARKING_STATUS.RESERVED]:
        "bg-warning/20 border-warning text-warning-foreground",
      [PARKING_STATUS.MAINTENANCE]:
        "bg-muted/20 border-muted text-muted-foreground",
    }),
    []
  );

  const buttonClassName = useMemo(() => {
    const baseClasses =
      "aspect-square rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center hover:scale-105";

    const statusStyle =
      statusStyles[effectiveStatus as keyof typeof statusStyles] ||
      statusStyles[PARKING_STATUS.MAINTENANCE];

    return cn(baseClasses, statusStyle);
  }, [effectiveStatus, statusStyles]);

  return {
    buttonClassName,
    spotNumber: spot.spot_number,
    handleViewDetails,
    handleReserveSpot,
    handleCheckInSpot,
  };
};
