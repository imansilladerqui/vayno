import { Card, CardContent } from "@/components/ui/card";
import { ParkingCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useParkingGridManagement } from "@/hooks/useParkingGridManagement";

export const ReservedStatCard = () => {
  const { id } = useParams<{ id: string }>();
  const { reservedSpots, totalSpots } = useParkingGridManagement(id!);

  const value = reservedSpots || 0;
  const total = totalSpots || 0;
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Reserved</p>
            <p className="text-3xl font-bold text-yellow-600">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {percentage}% of total
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
            <ParkingCircle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
