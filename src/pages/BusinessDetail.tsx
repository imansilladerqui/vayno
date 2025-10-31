import { DashboardLayout } from "@/components/DashboardLayout";
import { BusinessHeroCard } from "@/components/business/BusinessHeroCard";
import { AvailableStatCard } from "@/components/business/AvailableStatCard";
import { OccupiedStatCard } from "@/components/business/OccupiedStatCard";
import { ReservedStatCard } from "@/components/business/ReservedStatCard";
import { MaintenanceStatCard } from "@/components/business/MaintenanceStatCard";
import { ParkingGrid } from "@/components/dashboard/ParkingGrid";
import { BusinessInfoCard } from "@/components/business/BusinessInfoCard";
import { TeamMembersCard } from "@/components/business/TeamMembersCard";
import { useParams } from "react-router-dom";

const BusinessDetail = () => {
  const { id } = useParams<{ id?: string }>();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BusinessHeroCard />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AvailableStatCard />
          <OccupiedStatCard />
          <ReservedStatCard />
          <MaintenanceStatCard />
        </div>

        <ParkingGrid businessId={id} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BusinessInfoCard />
          <TeamMembersCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDetail;
