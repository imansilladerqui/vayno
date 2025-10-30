import { useTodayRevenue } from "@/hooks/queries/useStatisticsQueries";

export const useStatisticsManagement = () => {
  const todayRevenueQuery = useTodayRevenue();

  return {
    // Data
    revenue: todayRevenueQuery.data,

    // Loading states
    isLoadingRevenue: todayRevenueQuery.isLoading,
    isLoading: todayRevenueQuery.isLoading,

    // Error states
    revenueError: todayRevenueQuery.error,
    error: todayRevenueQuery.error,
  };
};

