import {
  useTodayRevenue,
  useOccupancyStats,
  useParkingLotStats,
} from "@/hooks/queries/useStatistics";

/**
 * Hook for dashboard statistics and analytics
 * Aggregates all dashboard data in one place
 */
export const useDashboardStats = () => {
  // Data queries
  const occupancyQuery = useOccupancyStats();
  const revenueQuery = useTodayRevenue();
  const parkingLotStatsQuery = useParkingLotStats();

  // Derived calculations
  const totalSpots = occupancyQuery.data?.total || 0;
  const occupiedSpots = occupancyQuery.data?.occupied || 0;
  const availableSpots = occupancyQuery.data?.available || 0;
  const reservedSpots = occupancyQuery.data?.reserved || 0;
  const maintenanceSpots = occupancyQuery.data?.maintenance || 0;
  const revenue = revenueQuery.data || 0;

  // Calculate occupancy percentage
  const occupancyPercentage =
    totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0;

  // Calculate utilization percentage (occupied + reserved)
  const utilizationPercentage =
    totalSpots > 0
      ? Math.round(((occupiedSpots + reservedSpots) / totalSpots) * 100)
      : 0;

  return {
    // Occupancy stats
    occupancyStats: {
      total: totalSpots,
      available: availableSpots,
      occupied: occupiedSpots,
      reserved: reservedSpots,
      maintenance: maintenanceSpots,
      occupancyPercentage,
      utilizationPercentage,
    },

    // Revenue
    revenue,

    // Parking lot stats
    parkingLotStats: parkingLotStatsQuery.data,

    // Loading states
    isLoading:
      occupancyQuery.isLoading ||
      revenueQuery.isLoading ||
      parkingLotStatsQuery.isLoading,

    // Errors
    error:
      occupancyQuery.error || revenueQuery.error || parkingLotStatsQuery.error,
  };
};
