import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ParkingCircle } from "lucide-react";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";
import { useParkingManagement } from "@/hooks/useParkingManagement";
import { useState } from "react";
import { CheckInModal } from "@/components/parking/CheckInModal";
import { SpotDetailsDrawer } from "@/components/parking/SpotDetailsDrawer";
import { SpotStatusModal } from "@/components/parking/SpotStatusModal";
import { useActiveSession } from "@/hooks/queries/useActiveSession";
import type { ParkingSpotWithLot, ParkingStatus } from "@/types";

interface ParkingGridProps {
  businessId?: string;
}

export const ParkingGrid = ({ businessId }: ParkingGridProps) => {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpotWithLot | null>(
    null
  );
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const effectiveBusinessId = businessId || selectedBusinessId;
  const {
    parkingSpots,
    statusCounts,
    checkIn,
    checkOut,
    updateSpot,
    calculateCurrentCost,
    isCheckingIn,
    isCheckingOut,
    isUpdatingSpot,
  } = useParkingManagement(effectiveBusinessId);
  const { businesses } = useBusinessManagement();

  const { data: activeSession } = useActiveSession(selectedSpot?.id);
  const [calculatedCost, setCalculatedCost] = useState<{
    total: number;
    duration: string;
  } | null>(null);
  const [isLoadingCost, setIsLoadingCost] = useState(false);

  const statusStyles = {
    available:
      "bg-success/20 border-success text-success-foreground hover:bg-success/30 cursor-pointer",
    occupied:
      "bg-destructive/20 border-destructive text-destructive-foreground cursor-pointer",
    reserved:
      "bg-warning/20 border-warning text-warning-foreground cursor-pointer",
    maintenance:
      "bg-muted/20 border-muted text-muted-foreground cursor-pointer",
  };

  const handleSpotClick = (spot: ParkingSpotWithLot) => {
    setSelectedSpot(spot);

    if (spot.status === "available") {
      setCheckInModalOpen(true);
    } else if (spot.status === "occupied") {
      setDetailsDrawerOpen(true);
    } else {
      // Reserved or Maintenance
      setStatusModalOpen(true);
    }
  };

  const handleCheckIn = (data: {
    spotId: string;
    vehiclePlate: string;
    vehicleType?: "car" | "motorcycle" | "truck" | "van" | "other";
    userId?: string;
  }) => {
    checkIn(data, {
      onSuccess: () => {
        setCheckInModalOpen(false);
        setSelectedSpot(null);
      },
    });
  };

  const handleCheckOut = (sessionId: string) => {
    checkOut(
      { sessionId },
      {
        onSuccess: () => {
          setDetailsDrawerOpen(false);
          setSelectedSpot(null);
          setCalculatedCost(null);
        },
      }
    );
  };

  const handleCalculateCost = async (sessionId: string) => {
    setIsLoadingCost(true);
    try {
      const result = await calculateCurrentCost(sessionId);
      setCalculatedCost({
        total: result.currentCost,
        duration: result.duration,
      });
    } catch (error) {
      // Error already handled in calculateCurrentCost
    } finally {
      setIsLoadingCost(false);
    }
  };

  const handleUpdateStatus = (spotId: string, status: string) => {
    updateSpot(
      {
        id: spotId,
        updates: { status: status as ParkingStatus },
      },
      {
        onSuccess: () => {
          setStatusModalOpen(false);
          setSelectedSpot(null);
        },
      }
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Parking Spots Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {parkingSpots?.length || 0} spots
              </p>
            </div>
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/20 border-2 border-success"></div>
                <span className="text-sm text-muted-foreground">
                  Available ({statusCounts?.available || 0})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive"></div>
                <span className="text-sm text-muted-foreground">
                  Occupied ({statusCounts?.occupied || 0})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-warning/20 border-2 border-warning"></div>
                <span className="text-sm text-muted-foreground">
                  Reserved ({statusCounts?.reserved || 0})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted/20 border-2 border-muted"></div>
                <span className="text-sm text-muted-foreground">
                  Maintenance ({statusCounts?.maintenance || 0})
                </span>
              </div>
            </div>
            {!businessId && (
              <div className="w-64">
                <Select
                  value={selectedBusinessId}
                  onValueChange={(v) => setSelectedBusinessId(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      (businesses as Array<{ id: string; name: string }>) || []
                    ).map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {parkingSpots && parkingSpots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {parkingSpots?.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className={cn(
                    "aspect-square rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center hover:scale-105",
                    statusStyles[spot.status as keyof typeof statusStyles] ||
                      statusStyles.maintenance
                  )}
                  title={`Spot ${spot.spot_number} - ${spot.status}${
                    spot.is_handicap_accessible ? " (Handicap Accessible)" : ""
                  }${spot.is_electric_charging ? " (EV Charging)" : ""}`}
                >
                  {spot.spot_number}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ParkingCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {businessId
                  ? "No parking spots found for this business"
                  : "Choose a business to view its parking spots."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSpot && (
        <>
          <CheckInModal
            open={checkInModalOpen}
            onOpenChange={setCheckInModalOpen}
            spotId={selectedSpot.id}
            spotNumber={parseInt(selectedSpot.spot_number) || 0}
            onCheckIn={handleCheckIn}
            isLoading={isCheckingIn}
          />

          <SpotDetailsDrawer
            open={detailsDrawerOpen}
            onOpenChange={setDetailsDrawerOpen}
            spot={selectedSpot}
            session={activeSession || undefined}
            currentCost={calculatedCost}
            onCheckOut={handleCheckOut}
            onCalculateCost={handleCalculateCost}
            isLoadingCost={isLoadingCost}
            isCheckingOut={isCheckingOut}
          />

          <SpotStatusModal
            open={statusModalOpen}
            onOpenChange={setStatusModalOpen}
            spot={selectedSpot}
            onUpdateStatus={handleUpdateStatus}
            isLoading={isUpdatingSpot}
          />
        </>
      )}
    </>
  );
};
