import { useStatisticsManagement } from "@/hooks/useStatisticsManagement";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";
import { useParkingManagement } from "@/hooks/useParkingManagement";

export interface DashboardData {
  occupancyStats?: {
    total?: number;
    occupied?: number;
    available?: number;
    reserved?: number;
    maintenance?: number;
    occupancyPercentage?: number;
  };
  revenue?: number;
  businesses?: Array<{
    id: string;
    name: string;
    is_active?: boolean;
  }>;
  users?: Array<{
    id: string;
    full_name?: string;
    email: string;
    is_active?: boolean;
  }>;
  activities?: Array<{
    id: string;
    action: string;
    table_name: string;
    created_at: string;
    profiles?: {
      full_name?: string;
    };
  }>;
  parkingSpots?: Array<{
    id: string;
    spot_number: string;
    status: string;
    parking_lots?: {
      name: string;
    };
    is_handicap_accessible?: boolean;
    is_electric_charging?: boolean;
  }>;
  stats: {
    totalBusinesses: number;
    activeBusinesses: number;
    totalUsers: number;
    activeUsers: number;
    totalSpots: number;
  };
}

export const useDashboard = () => {
  const {
    revenue,
    isLoading: isLoadingStatistics,
    error: statisticsError,
  } = useStatisticsManagement();
  const {
    businesses,
    isLoading: isLoadingBusinesses,
    error: businessesError,
  } = useBusinessManagement();
  const {
    users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useUserManagement();
  const {
    parkingSpots: parkingSpots,
    isLoadingSpots: isLoadingSpots,
    spotsError,
    activities,
    isLoadingActivities,
    activitiesError,
    occupancyStats: occupancy,
  } = useParkingManagement({ includeParkingLots: false });

  // Combine loading and error states
  const isLoading =
    isLoadingStatistics ||
    isLoadingBusinesses ||
    isLoadingUsers ||
    isLoadingSpots ||
    isLoadingActivities;

  const error =
    statisticsError ||
    businessesError ||
    usersError ||
    spotsError ||
    activitiesError;

  const totalSpots = occupancy?.total || 0;
  const occupiedSpots = occupancy?.occupied || 0;
  const reservedSpots = occupancy?.reserved || 0;

  const businessesData = (businesses as Array<{ is_active?: boolean }>) || [];
  const usersList = (users as Array<{ is_active?: boolean }>) || [];
  const parkingSpotsList = (parkingSpots as unknown[]) || [];

  const stats = {
    totalBusinesses: businessesData.length,
    activeBusinesses: businessesData.filter((b) => b.is_active).length,
    totalUsers: usersList.length,
    activeUsers: usersList.filter(
      (u) => (u as { is_active?: boolean }).is_active
    ).length,
    totalSpots: parkingSpotsList.length,
  };

  return {
    data: {
      occupancyStats: {
        total: totalSpots,
        available: occupancy?.available || 0,
        occupied: occupiedSpots,
        reserved: reservedSpots,
        maintenance: occupancy?.maintenance || 0,
        occupancyPercentage:
          totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0,
      },
      revenue: revenue || 0,
      businesses: businesses as Array<{
        id: string;
        name: string;
        is_active?: boolean;
      }>,
      users: users as Array<{
        id: string;
        full_name?: string;
        email: string;
        is_active?: boolean;
      }>,
      activities: (
        activities as Array<{
          id: string;
          action: string;
          table_name: string;
          created_at: string;
          profiles?: {
            full_name?: string;
          };
        }>
      )?.slice(0, 5),
      parkingSpots: parkingSpots as Array<{
        id: string;
        spot_number: string;
        status: string;
        parking_lots?: {
          name: string;
        };
        is_handicap_accessible?: boolean;
        is_electric_charging?: boolean;
      }>,
      stats,
    },
    isLoading,
    error,
  };
};
