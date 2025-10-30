import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Car, Clock, DollarSign, AlertTriangle, Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useParkingManagement } from "@/hooks/useParkingManagement";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
  ParkingSpot,
  ParkingStatus,
  ParkingSessionWithDetails,
} from "@/types";

const Parking = () => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<ParkingSessionWithDetails | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [vehiclePlate, setVehiclePlate] = useState("");

  const {
    parkingSpots: spots,
    activeSessions,
    isLoadingSpots,
    isLoadingSessions,
    spotsError,
    sessionsError,
    isCheckingIn,
    isCheckingOut,
    isUpdatingSpot,
    checkIn,
    checkOut,
    updateSpot,
  } = useParkingManagement();

  const isLoading = isLoadingSpots || isLoadingSessions;
  const hasError = spotsError || sessionsError;

  const activeSessionsMap =
    activeSessions?.reduce((acc, session) => {
      if (session.spot_id) {
        acc[session.spot_id] = session;
      }
      return acc;
    }, {} as Record<string, ParkingSessionWithDetails>) || {};

  const handleCheckIn = () => {
    if (!selectedSpot || !vehiclePlate.trim()) return;

    checkIn(
      {
        spotId: selectedSpot.id,
        vehiclePlate: vehiclePlate.trim(),
        vehicleType: "car",
      },
      {
        onSuccess: () => {
          setIsCheckInOpen(false);
          setSelectedSpot(null);
          setVehiclePlate("");
        },
      }
    );
  };

  const handleCheckOut = (
    sessionId: string,
    paymentMethod: string = "cash"
  ) => {
    checkOut(
      { sessionId, paymentMethod },
      {
        onSuccess: () => {
          setIsCheckOutOpen(false);
          setSelectedSession(null);
        },
      }
    );
  };

  const handleStatusChange = (spotId: string, newStatus: string) => {
    updateSpot(
      {
        id: spotId,
        updates: { status: newStatus as ParkingStatus },
      },
      {
        onSuccess: () => {
          // Toast is handled by management hook
        },
      }
    );
  };

  const openCheckIn = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setIsCheckInOpen(true);
  };

  const openCheckOut = (session: ParkingSessionWithDetails) => {
    setSelectedSession(session);
    setIsCheckOutOpen(true);
  };

  const formatDuration = (checkInTime: string) => {
    const now = new Date();
    const checkIn = new Date(checkInTime);
    const diffMs = now.getTime() - checkIn.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m`;
    }
    return `${diffMins}m`;
  };

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Parking Spots</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all parking spots
            </p>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load parking spots. Please check your connection and try
              again.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Parking Spots</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all parking spots
            </p>
          </div>

          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading parking spots..." />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!spots || spots.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Parking Spots</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all parking spots
            </p>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No parking spots found
              </p>
              <p className="text-sm text-muted-foreground">
                Create some parking spots in your parking lot to get started.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Parking Spots</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all parking spots
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {spots.map((spot) => {
            const activeSession = activeSessionsMap[spot.id];
            const isOccupied = spot.status === "occupied" && activeSession;

            return (
              <Card key={spot.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Spot {spot.spot_number}
                    </CardTitle>
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
                      className={
                        spot.status === "available"
                          ? "bg-success hover:bg-success"
                          : spot.status === "reserved"
                          ? "bg-warning hover:bg-warning"
                          : ""
                      }
                    >
                      {spot.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {spot.is_handicap_accessible && (
                      <Badge variant="outline" className="text-xs">
                        Handicap
                      </Badge>
                    )}
                    {spot.is_electric_charging && (
                      <Badge variant="outline" className="text-xs">
                        EV
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isOccupied && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono">
                          {activeSession.vehicle_plate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {activeSession.check_in_time
                            ? formatDuration(activeSession.check_in_time)
                            : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          $
                          {activeSession.parking_spots?.parking_lots
                            ?.hourly_rate ?? 0}
                          /hr
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        variant="outline"
                        onClick={() => {
                          openCheckOut(activeSession);
                        }}
                        disabled={isCheckingOut}
                      >
                        {isCheckingOut ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          "Check Out"
                        )}
                      </Button>
                    </div>
                  )}

                  {spot.status === "available" && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Ready for use
                      </p>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          openCheckIn(spot);
                        }}
                        disabled={isCheckingIn}
                      >
                        {isCheckingIn ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Check In
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {spot.status === "reserved" && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Reserved spot
                      </p>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        variant="outline"
                        onClick={() => handleStatusChange(spot.id, "available")}
                        disabled={isUpdatingSpot}
                      >
                        {isUpdatingSpot ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          "Mark Available"
                        )}
                      </Button>
                    </div>
                  )}

                  {spot.status === "maintenance" && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Under maintenance
                      </p>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        variant="outline"
                        onClick={() => handleStatusChange(spot.id, "available")}
                        disabled={isUpdatingSpot}
                      >
                        {isUpdatingSpot ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          "Mark Available"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Check In Dialog */}
        <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check In Vehicle</DialogTitle>
              <DialogDescription>
                Enter vehicle details for spot {selectedSpot?.spot_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-plate">License Plate</Label>
                <Input
                  id="vehicle-plate"
                  placeholder="ABC-1234"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCheckInOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCheckIn}
                disabled={!vehiclePlate.trim() || isCheckingIn}
              >
                {isCheckingIn ? <LoadingSpinner size="sm" /> : "Check In"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Check Out Dialog */}
        <Dialog open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check Out Vehicle</DialogTitle>
              <DialogDescription>
                Confirm checkout for {selectedSession?.vehicle_plate}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">
                  {selectedSession?.vehicle_plate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Duration:{" "}
                  {selectedSession && selectedSession.check_in_time
                    ? formatDuration(selectedSession.check_in_time)
                    : "-"}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCheckOutOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedSession?.id) {
                    handleCheckOut(selectedSession.id, "cash");
                  }
                }}
                disabled={isCheckingOut || !selectedSession?.id}
              >
                {isCheckingOut ? <LoadingSpinner size="sm" /> : "Check Out"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Parking;
