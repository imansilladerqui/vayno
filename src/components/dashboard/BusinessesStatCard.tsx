import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";

export const BusinessesStatCard = () => {
  const { totalBusinesses, activeBusinesses } = useBusinessManagement();
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Parkings</p>
            <p className="text-3xl font-bold">{totalBusinesses}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeBusinesses} active
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
