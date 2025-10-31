import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, User, Loader2 } from "lucide-react";
import type { ParkingSpotWithLot, ParkingSessionWithDetails } from "@/types";
import { formatDistanceToNow, format } from "date-fns";

interface SpotDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot: ParkingSpotWithLot;
  session?: ParkingSessionWithDetails | null;
  currentCost?: {
    total: number;
    duration: string;
  } | null;
  onCheckOut: (sessionId: string) => void;
  onCalculateCost: (sessionId: string) => Promise<void>;
  isLoadingCost?: boolean;
  isCheckingOut?: boolean;
}

export const SpotDetailsDrawer = ({
  open,
  onOpenChange,
  spot,
  session,
  currentCost,
  onCheckOut,
  onCalculateCost,
  isLoadingCost = false,
  isCheckingOut = false,
}: SpotDetailsDrawerProps) => {
  const handleCheckOut = () => {
    if (session?.id) {
      onCheckOut(session.id);
    }
  };

  const handleCalculateCost = async () => {
    if (session?.id) {
      await onCalculateCost(session.id);
    }
  };

  const checkInTime = session?.check_in_time
    ? new Date(session.check_in_time)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Spot {spot.spot_number}
            <Badge
              variant={
                spot.status === "available"
                  ? "default"
                  : spot.status === "occupied"
                  ? "destructive"
                  : spot.status === "reserved"
                  ? "secondary"
                  : "outline"
              }
            >
              {spot.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {spot.parking_lots?.name || "Parking Lot"} • {spot.spot_type || "Standard"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Spot Details */}
          <div className="space-y-3">
            <h3 className="font-semibold">Spot Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Spot Number</p>
                <p className="font-medium">{spot.spot_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{spot.spot_type || "Standard"}</p>
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

          {/* Current Session */}
          {session && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Current Session</h3>
                  <Badge variant="default">Active</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{session.vehicle_plate}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.vehicle_type || "Unknown type"}
                      </p>
                    </div>
                  </div>

                  {checkInTime && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Check-In Time</p>
                        <p className="font-medium">
                          {format(checkInTime, "MMM dd, yyyy HH:mm")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(checkInTime, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )}

                  {session.profiles && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Driver</p>
                        <p className="font-medium">
                          {session.profiles.full_name || "Guest"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.profiles.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentCost && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Current Cost</p>
                        <p className="text-2xl font-bold">${currentCost.total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Duration: {currentCost.duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCalculateCost}
                    disabled={isLoadingCost || isCheckingOut}
                    className="flex-1"
                  >
                    {isLoadingCost && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Calculate Cost
                  </Button>
                  <Button
                    onClick={handleCheckOut}
                    disabled={isCheckingOut || isLoadingCost}
                    className="flex-1"
                  >
                    {isCheckingOut && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Check Out
                  </Button>
                </div>
              </div>
            </>
          )}

          {!session && spot.status === "occupied" && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active session found</p>
            </div>
          )}

          {spot.status !== "occupied" && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active session</p>
              <p className="text-sm text-muted-foreground mt-2">
                This spot is currently {spot.status}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

