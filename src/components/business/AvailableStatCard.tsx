import { Card, CardContent } from "@/components/ui/card";
import { ParkingCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useParkingManagement } from "@/hooks/useParkingManagement";

export const AvailableStatCard = () => {
  const { id } = useParams<{ id?: string }>();
  const { availableSpots, totalSpots } = useParkingManagement(id);

  const value = availableSpots || 0;
  const total = totalSpots || 0;
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Available</p>
            <p className="text-3xl font-bold text-green-600">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {percentage}% of total
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <ParkingCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
