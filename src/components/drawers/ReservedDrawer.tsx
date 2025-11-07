import { SpotDetailsDrawer } from "@/components/drawers/SpotDetailsDrawer";
import { InfoRow } from "@/components/parking/InfoRow";
import { CustomerInfo } from "@/components/parking/CustomerInfo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, X, Car } from "lucide-react";
import { useParkingSpotManagement } from "@/hooks/useParkingSpotManagement";
import {
  formatTimeDifference,
  formatTimeUntil,
  DATE_FORMAT,
} from "@/lib/utils";
import type { ParkingSpotWithBusiness } from "@/types";
import { format } from "date-fns";

interface ReservedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot: ParkingSpotWithBusiness;
}

export const ReservedDrawer = ({
  open,
  onOpenChange,
  spot,
}: ReservedDrawerProps) => {
  const { reservation, handleCancelReservation, isCancellingReservation } =
    useParkingSpotManagement(spot.id);

  return (
    <SpotDetailsDrawer open={open} onOpenChange={onOpenChange} spot={spot}>
      {reservation && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Reservation</h3>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div className="space-y-3">
              <InfoRow
                icon={Clock}
                label="Reserved"
                value={format(new Date(reservation.created_at!), DATE_FORMAT)}
                secondary={formatTimeDifference(
                  new Date(reservation.created_at!)
                )}
              />

              {reservation.start_time && (
                <InfoRow
                  icon={Clock}
                  label="Check-In Time"
                  value={format(new Date(reservation.start_time), DATE_FORMAT)}
                  secondary={formatTimeUntil(
                    new Date(reservation.start_time),
                    ""
                  )}
                />
              )}

              {reservation.vehicle_plate && (
                <InfoRow
                  icon={Car}
                  iconBg="bg-primary/10"
                  iconColor="text-primary"
                  label="Vehicle Plate"
                  value={
                    <span className="font-mono">
                      {reservation.vehicle_plate}
                    </span>
                  }
                />
              )}

              <CustomerInfo
                name={reservation.customer_name || undefined}
                email={reservation.customer_email || undefined}
                phone={reservation.customer_phone || undefined}
                label="Reserved By"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="destructive"
                onClick={() =>
                  handleCancelReservation(reservation.id, {
                    onSuccess: () => {
                      onOpenChange(false);
                    },
                  })
                }
                disabled={isCancellingReservation}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Reservation
              </Button>
            </div>
          </div>
        </>
      )}
    </SpotDetailsDrawer>
  );
};
