import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { USER_ROLES } from "@/lib/utils";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
      role,
    }: {
      email: string;
      password: string;
      fullName: string;
      role?: "user" | "admin" | "superadmin";
    }) => {
      const userRole = role || USER_ROLES.USER;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: userRole,
          },
        },
      });

      if (authError) throw authError;
      return {
        user: authData.user,
        session: authData.session,
        needsEmailConfirmation: !authData.session,
      };
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
      };
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Record<string, unknown>;
    }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    },
  });
};
