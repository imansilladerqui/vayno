import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Clock, DollarSign } from "lucide-react";

interface ParkingSpot {
  id: string;
  number: number;
  status: "available" | "occupied" | "reserved";
  vehicle?: string;
  entryTime?: string;
  duration?: string;
  amount?: string;
}

const mockSpots: ParkingSpot[] = Array.from({ length: 100 }, (_, i) => {
  const status = i % 3 === 0 ? "occupied" : i % 5 === 0 ? "reserved" : "available";
  return {
    id: `spot-${i + 1}`,
    number: i + 1,
    status,
    vehicle: status === "occupied" ? `ABC-${1000 + i}` : undefined,
    entryTime: status === "occupied" ? "10:30 AM" : undefined,
    duration: status === "occupied" ? "2h 30m" : undefined,
    amount: status === "occupied" ? "$15.00" : undefined,
  };
});

const Parking = () => {
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
          {mockSpots.map((spot) => (
            <Card key={spot.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Spot #{spot.number}</CardTitle>
                  <Badge
                    variant={
                      spot.status === "available"
                        ? "default"
                        : spot.status === "occupied"
                        ? "destructive"
                        : "secondary"
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
              </CardHeader>
              <CardContent>
                {spot.status === "occupied" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{spot.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{spot.entryTime} • {spot.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{spot.amount}</span>
                    </div>
                    <Button size="sm" className="w-full mt-2" variant="outline">
                      Mark as Exit
                    </Button>
                  </div>
                )}
                {spot.status === "available" && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">Ready for use</p>
                    <Button size="sm" className="w-full">
                      Mark as Occupied
                    </Button>
                  </div>
                )}
                {spot.status === "reserved" && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Reserved spot</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Parking;
