import { useQuery } from "@tanstack/react-query";
import { DatabaseService } from "@/lib/database";

export const statisticsQueryKeys = {
  parkingLotStats: ["parking-lot-stats"] as const,
  todayRevenue: ["today-revenue"] as const,
  occupancyStats: ["occupancy-stats"] as const,
};

export const useParkingLotStats = (lotId?: string) => {
  return useQuery({
    queryKey: statisticsQueryKeys.parkingLotStats,
    queryFn: () => DatabaseService.getParkingLotStats(lotId),
    staleTime: 60 * 1000, // 1 minute
    retry: 3,
  });
};

export const useTodayRevenue = () => {
  return useQuery({
    queryKey: statisticsQueryKeys.todayRevenue,
    queryFn: DatabaseService.getTodayRevenue,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
};

export const useOccupancyStats = () => {
  return useQuery({
    queryKey: statisticsQueryKeys.occupancyStats,
    queryFn: DatabaseService.getOccupancyStats,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 3,
  });
};

export const useParkingStats = (lotId?: string) => {
  return useQuery({
    queryKey: ["parking-stats", lotId],
    queryFn: () => DatabaseService.getParkingStats(lotId),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
};
