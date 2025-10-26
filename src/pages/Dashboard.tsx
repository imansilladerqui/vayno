import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ParkingGrid } from "@/components/dashboard/ParkingGrid";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  Car,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const {
    occupancyStats,
    revenue,
    isLoading,
    error: hasError,
  } = useDashboardStats();

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please check your connection and
              try again.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
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
  } = occupancyStats || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Spots"
            value={totalSpots.toString()}
            icon={Car}
            variant="default"
          />
          <StatCard
            title="Occupied"
            value={occupiedSpots.toString()}
            icon={AlertCircle}
            trend={{
              value: `${occupancyPercentage}% occupancy`,
              isPositive: occupiedSpots > 0,
            }}
            variant="danger"
          />
          <StatCard
            title="Available"
            value={availableSpots.toString()}
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

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Reserved"
            value={reservedSpots.toString()}
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Maintenance"
            value={maintenanceSpots.toString()}
            icon={AlertCircle}
            variant="default"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyPercentage}%`}
            icon={TrendingUp}
            variant={
              occupancyPercentage > 80
                ? "danger"
                : occupancyPercentage > 60
                ? "warning"
                : "success"
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ParkingGrid />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
