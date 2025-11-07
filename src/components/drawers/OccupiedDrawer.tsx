import { useEffect } from "react";
import { SpotDetailsDrawer } from "@/components/drawers/SpotDetailsDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CreditCard, User } from "lucide-react";
import { useParkingSpotManagement } from "@/hooks/useParkingSpotManagement";
import { DATE_FORMAT } from "@/lib/utils";
import { format } from "date-fns";
import { InfoRow } from "@/components/parking/InfoRow";
import { CustomerInfo } from "@/components/parking/CustomerInfo";
import type { ParkingSpotWithBusiness } from "@/types";

interface OccupiedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot: ParkingSpotWithBusiness;
}

export const OccupiedDrawer = ({
  open,
  onOpenChange,
  spot,
}: OccupiedDrawerProps) => {
  const {
    isCheckingOut,
    parkingSpot,
    calculateSessionCost,
    parkingSpotFetching,
    checkOutSession,
    checkInTime,
    timeSinceCheckIn,
    calculatedSessionCost,
  } = useParkingSpotManagement(spot.id);

  useEffect(() => {
    calculateSessionCost().catch((error) => {
      console.error("Failed to calculate cost:", error);
    });
  }, [open, parkingSpot?.id, calculateSessionCost]);

  return (
    <SpotDetailsDrawer open={open} onOpenChange={onOpenChange} spot={spot}>
      {parkingSpotFetching && (
        <div className="py-6 text-sm text-muted-foreground">
          Loading session...
        </div>
      )}
      {parkingSpot && !parkingSpotFetching && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Current Session</h3>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="space-y-3">
              <InfoRow
                icon={User}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                label="Vehicle"
                value={parkingSpot.vehicle_plate}
                secondary={parkingSpot.vehicle_type}
              />

              <InfoRow
                icon={Clock}
                label="Check-In Time"
                value={format(checkInTime, DATE_FORMAT)}
                secondary={timeSinceCheckIn}
              />

              <CustomerInfo
                name={parkingSpot.customer_name}
                email={parkingSpot.customer_email}
                phone={parkingSpot.customer_phone}
              />
              <InfoRow
                icon={CreditCard}
                iconBg="bg-purple-100 dark:bg-purple-900/20"
                iconColor="text-purple-600 dark:text-purple-400"
                label="Current Cost"
                value={
                  <span className="text-2xl font-bold">
                    ${calculatedSessionCost?.total.toFixed(2)}
                  </span>
                }
                secondary={`Duration: ${calculatedSessionCost?.duration}`}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() =>
                  checkOutSession(parkingSpot.id, {
                    onSuccess: () => onOpenChange(false),
                  })
                }
                disabled={isCheckingOut}
                className="flex-1"
              >
                {isCheckingOut ? "Checking Out..." : "Check Out"}
              </Button>
            </div>
          </div>
        </>
      )}
    </SpotDetailsDrawer>
  );
};
