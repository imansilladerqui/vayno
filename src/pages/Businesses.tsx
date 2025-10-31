import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  ParkingCircle,
  Users,
  Building2,
  Activity,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";

const Businesses = () => {
  const { businesses, isLoading, error, editBusiness, deleteBusiness } =
    useBusinessManagement();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parking Businesses</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {businesses?.length || 0} Total
            </Badge>
            <Button
              onClick={() => navigate("/businesses/new")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Business
            </Button>
          </div>
        </div>

        {!isLoading && !error && businesses && businesses.length === 0 && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                  No businesses found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Get started by creating your first parking business
                </p>
                <Button
                  onClick={() => navigate("/businesses/new")}
                  className="mt-4 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Business
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && businesses && businesses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {businesses.map((business) => {
              const userCount = business.users?.length ?? 0;
              const spotsCount = business.spots_count ?? 0;

              return (
                <Card
                  key={business.id}
                  className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden"
                >
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                          <Building2 className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {business.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                business.is_active ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              <Activity className="h-3 w-3 mr-1" />
                              {business.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigate(`/business/${business.id}`)}
                          aria-label="View business"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => editBusiness(business)}
                          aria-label="Edit business"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteBusiness(business)}
                          aria-label="Delete business"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {business.address && (
                      <div className="flex items-start gap-3 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                        <span className="line-clamp-2">{business.address}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group-hover:bg-primary/5 transition-colors">
                        <ParkingCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-2xl font-bold">{spotsCount}</p>
                          <p className="text-xs text-muted-foreground">
                            Parking Spots
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group-hover:bg-primary/5 transition-colors">
                        <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-2xl font-bold">{userCount}</p>
                          <p className="text-xs text-muted-foreground">Users</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Businesses;
