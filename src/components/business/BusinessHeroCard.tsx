import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, TrendingUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useBusiness } from "@/hooks/queries/useBusinessQueries";
import { useParkingManagement } from "@/hooks/useParkingManagement";

export const BusinessHeroCard = () => {
  const { id } = useParams<{ id: string }>();
  const { data: business } = useBusiness(id || "");
  const { totalSpots, rate } = useParkingManagement(id);

  if (!business) return null;

  return (
    <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                {business.is_active !== false && (
                  <Badge className="bg-green-500">Active</Badge>
                )}
              </div>
              {business.description && (
                <p className="text-muted-foreground mb-3">
                  {business.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {business.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
                )}
                {business.city && <span>{business.city}</span>}
                {business.state && <span>{business.state}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Spots</p>
              <p className="text-3xl font-bold">{totalSpots || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Occupancy</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-2xl font-bold">{rate || 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

