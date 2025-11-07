import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";

export const TopBusinessesCard = () => {
  const { TopBusinessCardItems } = useBusinessManagement();
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Top Businesses</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/businesses")}
            className="text-white hover:bg-white/10"
          >
            View All
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {TopBusinessCardItems?.map((business) => (
            <div
              key={business.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/business/${business.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {business.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {business.spots_count || 0} spots
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {business.is_active ? (
                    <Badge variant="default">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
