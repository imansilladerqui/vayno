import { DashboardLayout } from "@/components/DashboardLayout";
import { ParkingGrid } from "@/components/dashboard/ParkingGrid";
import { LatestUsersCard } from "@/components/dashboard/LatestUsersCard";
import { TopBusinessesCard } from "@/components/dashboard/TopBusinessesCard";
import { BusinessesStatCard } from "@/components/dashboard/BusinessesStatCard";
import { UsersStatCard } from "@/components/dashboard/UsersStatCard";
import { TotalSpotsStatCard } from "@/components/dashboard/TotalSpotsStatCard";
import { OccupiedStatCard } from "@/components/business/OccupiedStatCard";
import { AvailableStatCard } from "@/components/business/AvailableStatCard";
import { ReservedStatCard } from "@/components/business/ReservedStatCard";
import { MaintenanceStatCard } from "@/components/business/MaintenanceStatCard";

const Dashboard = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BusinessesStatCard />
          <UsersStatCard />
          <TotalSpotsStatCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <OccupiedStatCard />
          <AvailableStatCard />
          <ReservedStatCard />
          <MaintenanceStatCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopBusinessesCard />
          <LatestUsersCard />
        </div>
        <ParkingGrid />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
