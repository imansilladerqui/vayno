import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ParkingGrid } from "@/components/dashboard/ParkingGrid";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { LatestUsersCard } from "@/components/dashboard/LatestUsersCard";
import { TopBusinessesCard } from "@/components/dashboard/TopBusinessesCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  Building2,
  Activity,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDashboard } from "@/hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboard();

  if (error || isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to load dashboard data. Please check your connection and try again."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Loading dashboard data..." />
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  const {
    total: totalSpots,
    occupied: occupiedSpots,
    available: availableSpots,
    reserved: reservedSpots,
    maintenance: maintenanceSpots,
    occupancyPercentage,
  } = data.occupancyStats || {};

  const revenue = data.revenue || 0;
  const businesses = data.businesses || [];
  const users = data.users || [];
  const activities = data.activities || [];
  const stats = data.stats;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Businesses
                  </p>
                  <p className="text-3xl font-bold">{stats.totalBusinesses}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.activeBusinesses} active
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.activeUsers} active
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Parking Spots
                  </p>
                  <p className="text-3xl font-bold">{stats.totalSpots}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all businesses
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Growth</p>
                  <p className="text-3xl font-bold">+12%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    This month
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Spots"
            value={totalSpots?.toString() || "0"}
            icon={Car}
            variant="default"
          />
          <StatCard
            title="Occupied"
            value={occupiedSpots?.toString() || "0"}
            icon={AlertCircle}
            trend={{
              value: `${occupancyPercentage || 0}% occupancy`,
              isPositive: (occupiedSpots || 0) > 0,
            }}
            variant="danger"
          />
          <StatCard
            title="Available"
            value={availableSpots?.toString() || "0"}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Today's Revenue"
            value={`$${revenue.toFixed(2)}`}
            icon={DollarSign}
            trend={{
              value: revenue > 0 ? "Revenue generated" : "No revenue yet",
              isPositive: revenue > 0,
            }}
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Reserved"
            value={reservedSpots?.toString() || "0"}
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Maintenance"
            value={maintenanceSpots?.toString() || "0"}
            icon={AlertCircle}
            variant="default"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyPercentage || 0}%`}
            icon={TrendingUp}
            variant={
              (occupancyPercentage || 0) > 80
                ? "danger"
                : (occupancyPercentage || 0) > 60
                ? "warning"
                : "success"
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopBusinessesCard
            businesses={businesses}
            onViewAll={() => navigate("/businesses")}
            onBusinessClick={(businessId) =>
              navigate(`/businesses/${businessId}/edit`)
            }
            limit={5}
          />

          <LatestUsersCard
            users={users}
            onViewAll={() => navigate("/users")}
            onUserClick={(userId) => navigate(`/users/${userId}/edit`)}
            limit={5}
          />
        </div>

        <RecentActivityCard
          activities={activities}
          onViewAll={() => navigate("/activity")}
          limit={5}
        />

        <ParkingGrid parkingSpots={data.parkingSpots} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
