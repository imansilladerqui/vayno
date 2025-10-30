import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ParkingGridProps {
  parkingSpots?: Array<{
    id: string;
    spot_number: string;
    status: string;
    parking_lots?: {
      name: string;
    };
    is_handicap_accessible?: boolean;
    is_electric_charging?: boolean;
  }>;
}

export const ParkingGrid = ({ parkingSpots: spots }: ParkingGridProps) => {
  if (!spots || spots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parking Spots Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No parking spots found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create some parking spots in your parking lot to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusStyles = {
    available:
      "bg-success/20 border-success text-success-foreground hover:bg-success/30",
    occupied:
      "bg-destructive/20 border-destructive text-destructive-foreground",
    reserved: "bg-warning/20 border-warning text-warning-foreground",
    maintenance: "bg-muted/20 border-muted text-muted-foreground",
  };

  // Group spots by lot for better organization
  const spotsByLot = spots.reduce((acc, spot) => {
    const lotName = spot.parking_lots?.name || "Unknown Lot";
    if (!acc[lotName]) {
      acc[lotName] = [];
    }
    acc[lotName].push(spot);
    return acc;
  }, {} as Record<string, typeof spots>);

  const statusCounts = spots.reduce((acc, spot) => {
    acc[spot.status] = (acc[spot.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parking Spots Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          {spots.length} total spots across {Object.keys(spotsByLot).length}{" "}
          parking lot(s)
        </p>
      </CardHeader>
      <CardContent>
        {Object.entries(spotsByLot).map(([lotName, lotSpots]) => (
          <div key={lotName} className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {lotName} ({lotSpots.length} spots)
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {lotSpots.map((spot) => (
                <button
                  key={spot.id}
                  className={cn(
                    "aspect-square rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center",
                    statusStyles[spot.status],
                    spot.status === "available" &&
                      "cursor-pointer hover:scale-105"
                  )}
                  title={`Spot ${spot.spot_number} - ${spot.status}${
                    spot.is_handicap_accessible ? " (Handicap Accessible)" : ""
                  }${spot.is_electric_charging ? " (EV Charging)" : ""}`}
                >
                  {spot.spot_number}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-6 mt-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/20 border-2 border-success"></div>
            <span className="text-sm text-muted-foreground">
              Available ({statusCounts.available || 0})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive"></div>
            <span className="text-sm text-muted-foreground">
              Occupied ({statusCounts.occupied || 0})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning/20 border-2 border-warning"></div>
            <span className="text-sm text-muted-foreground">
              Reserved ({statusCounts.reserved || 0})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted/20 border-2 border-muted"></div>
            <span className="text-sm text-muted-foreground">
              Maintenance ({statusCounts.maintenance || 0})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
