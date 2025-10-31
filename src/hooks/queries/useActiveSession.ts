import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ParkingSessionWithDetails } from "@/types";

export const useActiveSession = (spotId?: string) => {
  return useQuery({
    queryKey: ["active-session", spotId],
    queryFn: async (): Promise<ParkingSessionWithDetails | null> => {
      if (!spotId) return null;

      const { data, error } = await supabase
        .from("parking_sessions")
        .select(
          `
          *,
          parking_spots!inner(
            *,
            parking_lots!inner(*)
          ),
          profiles(*)
        `
        )
        .eq("spot_id", spotId)
        .is("check_out_time", null)
        .order("check_in_time", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data || null;
    },
    enabled: !!spotId,
  });
};

