import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formatDuration = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const calculateAverageDuration = (
  sessions: Array<{ check_in_time: string; check_out_time: string | null }>
): string => {
  if (!sessions || sessions.length === 0) return "0m";

  const completedSessions = sessions.filter(
    (s) => s.check_out_time && s.check_in_time
  );
  if (completedSessions.length === 0) return "0m";

  const totalDuration = completedSessions.reduce((sum, session) => {
    if (!session.check_in_time || !session.check_out_time) return sum;
    const checkIn = new Date(session.check_in_time);
    const checkOut = new Date(session.check_out_time);
    return sum + (checkOut.getTime() - checkIn.getTime());
  }, 0);

  const averageMs = totalDuration / completedSessions.length;
  return formatDuration(averageMs);
};

export const statisticsQueryKeys = {
  all: ["statistics"] as const,
  parkingLotStats: ["statistics", "parking-lot-stats"] as const,
  todayRevenue: ["statistics", "today-revenue"] as const,
  occupancyStats: ["statistics", "occupancy-stats"] as const,
  parkingStats: (lotId?: string) =>
    ["statistics", "parking-stats", lotId] as const,
};

export const useParkingLotStats = (lotId?: string) => {
  return useQuery({
    queryKey: statisticsQueryKeys.parkingLotStats,
    queryFn: async () => {
      let query = supabase.from("parking_lot_stats").select("*");

      if (lotId) {
        query = query.eq("id", lotId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

export const useOccupancyStats = () => {
  return useQuery({
    queryKey: statisticsQueryKeys.occupancyStats,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parking_spots")
        .select("status");

      if (error) throw error;

      const stats =
        data?.reduce((acc, spot) => {
          if (spot.status) {
            acc[spot.status] = (acc[spot.status] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>) || {};

      return {
        total: Object.values(stats).reduce(
          (sum: number, count: number) => sum + count,
          0
        ),
        available: stats.available || 0,
        occupied: stats.occupied || 0,
        reserved: stats.reserved || 0,
        maintenance: stats.maintenance || 0,
      };
    },
  });
};

export const useParkingStats = (lotId?: string) => {
  return useQuery({
    queryKey: statisticsQueryKeys.parkingStats(lotId),
    queryFn: async () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const { data: todaySessions } = await supabase
        .from("parking_sessions")
        .select("total_amount, check_in_time, check_out_time")
        .gte("check_in_time", today.toISOString())
        .lt("check_in_time", tomorrow.toISOString());

      const { data: activeSessions } = await supabase
        .from("parking_sessions")
        .select(
          `
          *,
          parking_spots!inner(
            *,
            parking_lots!inner(*)
          )
        `
        )
        .is("check_out_time", null);

      const totalRevenue =
        (todaySessions || []).reduce(
          (sum, session) => sum + (session.total_amount || 0),
          0
        ) || 0;

      const activeCount = activeSessions?.length || 0;
      const completedCount =
        (todaySessions || []).filter((s) => s.check_out_time).length || 0;

      return {
        totalRevenue,
        activeSessions: activeCount,
        completedSessions: completedCount,
        averageSessionDuration: calculateAverageDuration(
          (todaySessions || [])
            .filter(
              (s) => s.check_in_time !== null && s.check_out_time !== null
            )
            .map((s) => ({
              check_in_time: s.check_in_time!,
              check_out_time: s.check_out_time!,
            }))
        ),
      };
    },
  });
};
