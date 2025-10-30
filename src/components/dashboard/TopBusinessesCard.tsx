import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface TopBusinessesCardProps {
  businesses?: Array<{
    id: string;
    name: string;
    is_active?: boolean;
  }>;
  onViewAll?: () => void;
  onBusinessClick?: (businessId: string) => void;
  limit?: number;
}

export const TopBusinessesCard = ({
  businesses,
  onViewAll,
  onBusinessClick,
  limit = 5,
}: TopBusinessesCardProps) => {
  if (!businesses || businesses.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle className="text-white">Top Businesses</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No businesses found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Businesses will appear here once they are created.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedBusinesses = businesses.slice(0, limit);

  const handleBusinessClick = (businessId: string) => {
    if (onBusinessClick) {
      onBusinessClick(businessId);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Top Businesses</CardTitle>
          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-white hover:bg-white/10"
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedBusinesses.map((business, idx) => (
            <div
              key={business.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => handleBusinessClick(business.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <span className="font-bold text-lg text-purple-600">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {business.name}
                    </p>
                    <p className="text-sm text-muted-foreground">-- spots</p>
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
