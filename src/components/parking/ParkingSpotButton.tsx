import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, CheckCircle } from "lucide-react";
import { useParkingSpotButton } from "@/hooks/useParkingSpotButton";
import type { ParkingSpotWithBusiness } from "@/types";
import { PARKING_STATUS } from "@/lib/utils";

interface ParkingSpotButtonProps {
  spot: ParkingSpotWithBusiness;
  onCancelReservation?: (reservationId: string) => void;
}

export const ParkingSpotButton = memo<ParkingSpotButtonProps>(({ spot }) => {
  const {
    buttonClassName,
    spotNumber,
    handleViewDetails,
    handleReserveSpot,
    handleCheckInSpot,
  } = useParkingSpotButton({ spot });

  const buttonContent = (
    <button onClick={handleViewDetails} className={buttonClassName}>
      {spotNumber}
    </button>
  );

  if (spot.status === PARKING_STATUS.AVAILABLE) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{buttonContent}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCheckInSpot}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Check In Now
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReserveSpot}>
            <Clock className="h-4 w-4 mr-2" />
            Reserve Spot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return buttonContent;
});
