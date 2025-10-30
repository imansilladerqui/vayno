import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProfileWithBusiness = {
  id: string;
  role?: string;
  business_id?: string | null;
  businesses?: {
    id: string;
    name: string;
    address?: string;
  } | null;
  [key: string]: unknown;
};

export const profileQueryKeys = {
  all: ["profiles"] as const,
  current: (userId?: string) =>
    [...profileQueryKeys.all, "current", userId] as const,
};

export const useCurrentProfile = (userId?: string) => {
  return useQuery<ProfileWithBusiness | null>({
    queryKey: profileQueryKeys.current(userId),
    queryFn: async (): Promise<ProfileWithBusiness | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          businesses:business_id (
            id,
            name,
            address
          )
        `
        )
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as ProfileWithBusiness;
    },
    enabled: !!userId,
  });
};
