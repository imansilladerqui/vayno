import { Card, CardContent } from "@/components/ui/card";
import { ParkingCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useParkingGridManagement } from "@/hooks/useParkingGridManagement";

export const TotalSpotsStatCard = () => {
  const { id } = useParams<{ id: string }>();
  const { totalSpots } = useParkingGridManagement(id!);

  const value = totalSpots || 0;

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Spots</p>
            <p className="text-3xl font-bold text-blue-600">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <ParkingCircle className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
