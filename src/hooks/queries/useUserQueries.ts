import { useQuery, useMutation } from "@tanstack/react-query";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useCrudMutationConfig, EntityNames } from "@/lib/mutationHelpers";

export const userQueryKeys = {
  all: ["users"] as const,
  list: () => [...userQueryKeys.all, "list"] as const,
  detail: (id: string) => [...userQueryKeys.all, "detail", id] as const,
  byBusiness: (businessId?: string) =>
    [...userQueryKeys.all, "by-business", businessId] as const,
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          businesses:business_id (
            id,
            name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUsersByBusiness = (businessId?: string) => {
  return useQuery({
    queryKey: userQueryKeys.byBusiness(businessId),
    queryFn: async () => {
      if (!businessId) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("business_id", businessId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      full_name: string;
      role: UserRole;
      phone?: string;
      password?: string;
      sendPasswordEmail?: boolean;
    }) => {
      if (!data.password && !data.sendPasswordEmail) {
        throw new Error(
          "Either password or sendPasswordEmail must be provided"
        );
      }

      const generateSecurePassword = (): string => {
        const charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 16; i++) {
          password += charset.charAt(
            Math.floor(Math.random() * charset.length)
          );
        }
        return password;
      };

      const tempPassword = data.password || generateSecurePassword();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: tempPassword,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
          },
          emailRedirectTo: undefined,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        let profile;

        if (data.phone) {
          const { data: updatedProfile, error: updateError } = await supabase
            .from("profiles")
            .update({ phone: data.phone })
            .eq("id", authData.user.id)
            .select()
            .single();

          if (updateError) throw updateError;
          profile = updatedProfile;
        } else {
          const { data: fetchedProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (fetchError) throw fetchError;
          profile = fetchedProfile;
        }

        if (data.sendPasswordEmail && data.email) {
          // TODO: Implement email sending
          console.log("Password email would be sent to:", data.email);
          console.log("Temporary password:", tempPassword);
        }

        return {
          ...profile,
          tempPassword: data.sendPasswordEmail ? undefined : tempPassword,
        };
      }

      throw new Error("Failed to create user");
    },
    ...useCrudMutationConfig({
      invalidateKeys: userQueryKeys.all,
      entityName: EntityNames.User,
      action: "create",
    }),
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: {
        full_name?: string;
        email?: string;
        role?: UserRole;
        phone?: string;
        business_id?: string | null;
        is_active?: boolean;
      };
    }) => {
      const { data: updated, error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    ...useCrudMutationConfig({
      invalidateKeys: userQueryKeys.all,
      entityName: EntityNames.User,
      action: "update",
    }),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      if (error) throw error;
    },
    ...useCrudMutationConfig({
      invalidateKeys: userQueryKeys.all,
      entityName: EntityNames.User,
      action: "delete",
    }),
  });
};
