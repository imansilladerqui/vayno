import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessFormData } from "@/hooks/useBusinessManagement";
import { useCrudMutationConfig, EntityNames } from "@/lib/mutationHelpers";

export type Business = {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  tax_id?: string;
  business_type?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  spots_count?: number;
  users?: Array<{
    id: string;
    full_name?: string;
    email: string;
    role?: string;
  }>;
};

export const useAllBusinesses = () => {
  return useQuery<Business[]>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const [businessesResult, parkingLotsResult] = await Promise.all([
        supabase
          .from("businesses")
          .select(
            "*, profiles!profiles_business_id_fkey(id, full_name, email, role)"
          )
          .order("name"),
        supabase
          .from("parking_lots")
          .select("id, business_id")
          .not("business_id", "is", null),
      ]);

      if (businessesResult.error) {
        throw new Error(
          `Failed to fetch businesses: ${businessesResult.error.message}`
        );
      }

      if (!businessesResult.data || !Array.isArray(businessesResult.data)) {
        return [];
      }

      const spotsCountMap = new Map<string, number>();
      if (!parkingLotsResult.error && parkingLotsResult.data) {
        (
          parkingLotsResult.data as unknown as Array<{ business_id: string }>
        ).forEach((lot) => {
          if (lot?.business_id) {
            spotsCountMap.set(
              lot.business_id,
              (spotsCountMap.get(lot.business_id) || 0) + 1
            );
          }
        });
      }

      return businessesResult.data.map((business) => ({
        ...business,
        spots_count: spotsCountMap.get(business.id) || 0,
        users: (business.profiles || []) as Array<{
          id: string;
          full_name?: string;
          email: string;
          role?: string;
        }>,
      })) as Business[];
    },
  });
};

export const useBusiness = (businessId: string) => {
  return useQuery<Business>({
    queryKey: ["businesses", businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select(
          "*, profiles!profiles_business_id_fkey(id, full_name, email, role)"
        )
        .eq("id", businessId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch business: ${error.message}`);
      }

      if (!data) {
        throw new Error("Business not found");
      }

      const { count: spotsCount } = await supabase
        .from("parking_lots")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessId);

      return {
        ...data,
        spots_count: spotsCount || 0,
        users: (data.profiles || []) as Array<{
          id: string;
          full_name?: string;
          email: string;
          role?: string;
        }>,
      } as Business;
    },
    enabled: !!businessId,
  });
};

// Mutation Hooks - Direct exports
export const useUpdateBusiness = () => {
  return useMutation({
    mutationFn: async ({
      businessId,
      data,
    }: {
      businessId: string;
      data: Partial<Business>;
    }) => {
      const { data: updated, error } = await supabase
        .from("businesses")
        .update(data)
        .eq("id", businessId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update business: ${error.message}`);
      }

      return updated;
    },
    ...useCrudMutationConfig({
      invalidateKeys: ["businesses"],
      entityName: EntityNames.Business,
      action: "update",
    }),
  });
};

export const useCreateBusiness = () => {
  return useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const { data: created, error } = await supabase
        .from("businesses")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return created;
    },
    ...useCrudMutationConfig({
      invalidateKeys: ["businesses"],
      entityName: EntityNames.Business,
      action: "create",
    }),
  });
};

export const useDeleteBusiness = () => {
  return useMutation({
    mutationFn: async (businessId: string) => {
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", businessId);

      if (error) {
        throw new Error(`Failed to delete business: ${error.message}`);
      }
    },
    ...useCrudMutationConfig({
      invalidateKeys: ["businesses"],
      entityName: EntityNames.Business,
      action: "delete",
    }),
  });
};
