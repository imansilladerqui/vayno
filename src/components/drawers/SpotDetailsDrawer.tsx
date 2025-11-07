import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ParkingStatusBadge } from "@/components/parking/ParkingStatusBadge";
import type { ParkingSpotWithBusiness } from "@/types";
import { PARKING_STATUS } from "@/lib/utils";

interface SpotDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot: ParkingSpotWithBusiness;
  children?: React.ReactNode;
}

export const SpotDetailsDrawer = ({
  open,
  onOpenChange,
  spot,
  children,
}: SpotDetailsDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Spot {spot.spot_number}
            <ParkingStatusBadge
              status={spot.status || PARKING_STATUS.AVAILABLE}
            />
          </SheetTitle>
          <SheetDescription>
            {spot.businesses?.name} • {spot.spot_type}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Spot Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Spot Number</p>
                <p className="font-medium">{spot.spot_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{spot.spot_type}</p>
              </div>
              {spot.is_handicap_accessible && (
                <div>
                  <p className="text-muted-foreground">Accessibility</p>
                  <Badge variant="outline">Handicap Accessible</Badge>
                </div>
              )}
              {spot.is_electric_charging && (
                <div>
                  <p className="text-muted-foreground">Features</p>
                  <Badge variant="outline">EV Charging</Badge>
                </div>
              )}
            </div>
          </div>

          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
