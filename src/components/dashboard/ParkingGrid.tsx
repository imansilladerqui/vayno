import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ParkingSpot {
  id: string;
  number: number;
  status: "available" | "occupied" | "reserved";
}

const mockSpots: ParkingSpot[] = Array.from({ length: 24 }, (_, i) => ({
  id: `spot-${i + 1}`,
  number: i + 1,
  status: i % 3 === 0 ? "occupied" : i % 5 === 0 ? "reserved" : "available",
}));

export const ParkingGrid = () => {
  const statusStyles = {
    available: "bg-success/20 border-success text-success-foreground hover:bg-success/30",
    occupied: "bg-destructive/20 border-destructive text-destructive-foreground",
    reserved: "bg-warning/20 border-warning text-warning-foreground",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parking Spots Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {mockSpots.map((spot) => (
            <button
              key={spot.id}
              className={cn(
                "aspect-square rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center",
                statusStyles[spot.status],
                spot.status === "available" && "cursor-pointer"
              )}
            >
              {spot.number}
            </button>
          ))}
        </div>
        <div className="flex gap-6 mt-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/20 border-2 border-success"></div>
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive"></div>
            <span className="text-sm text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning/20 border-2 border-warning"></div>
            <span className="text-sm text-muted-foreground">Reserved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
