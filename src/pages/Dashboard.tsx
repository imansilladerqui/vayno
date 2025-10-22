import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ParkingGrid } from "@/components/dashboard/ParkingGrid";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Car, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

const Dashboard = () => {
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
            value="100"
            icon={Car}
            variant="default"
          />
          <StatCard
            title="Occupied"
            value="67"
            icon={AlertCircle}
            trend={{ value: "+5 from yesterday", isPositive: true }}
            variant="danger"
          />
          <StatCard
            title="Available"
            value="33"
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Today's Revenue"
            value="$1,250"
            icon={DollarSign}
            trend={{ value: "+12% from yesterday", isPositive: true }}
            variant="default"
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
