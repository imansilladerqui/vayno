import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParkingCircle } from "lucide-react";
import { useParkingGridManagement } from "@/hooks/useParkingGridManagement";
import { ParkingSpotButton } from "@/components/parking/ParkingSpotButton";
import { PARKING_STATUS } from "@/lib/utils";

interface ParkingGridProps {
  businessId: string;
}

export const ParkingGrid = memo<ParkingGridProps>(({ businessId }) => {
  const {
    parkingSpots,
    totalSpots,
    statusCounts,
    selectedBusinessId,
    setSelectedBusinessId,
    businessesList,
  } = useParkingGridManagement(businessId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Parking Spots Overview</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {totalSpots} spots
            </p>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/20 border-2 border-success"></div>
              <span className="text-sm text-muted-foreground">
                Available ({statusCounts?.[PARKING_STATUS.AVAILABLE] || 0})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive"></div>
              <span className="text-sm text-muted-foreground">
                Occupied ({statusCounts?.[PARKING_STATUS.OCCUPIED] || 0})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning/20 border-2 border-warning"></div>
              <span className="text-sm text-muted-foreground">
                Reserved ({statusCounts?.[PARKING_STATUS.RESERVED] || 0})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted/20 border-2 border-muted"></div>
              <span className="text-sm text-muted-foreground">
                Maintenance ({statusCounts?.[PARKING_STATUS.MAINTENANCE] || 0})
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
                  {businessesList.map((b) => (
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
        {totalSpots > 0 && selectedBusinessId ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {parkingSpots?.map((spot) => (
              <ParkingSpotButton key={spot.id} spot={spot} />
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
  );
});

ParkingGrid.displayName = "ParkingGrid";
