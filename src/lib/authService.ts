import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/types";
import { USER_ROLES } from "@/lib/constants";

export class AuthService {
  static async signUp(
    email: string,
    password: string,
    fullName: string,
    role?: UserRole
  ) {
    const userRole = role || USER_ROLES.CUSTOMER;

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

    if (authData.user) {
      // Create profile record
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: userRole,
      });

      if (profileError) {
        throw profileError;
      }
    }

    return {
      user: authData.user,
      session: authData.session,
      needsEmailConfirmation: !authData.session,
    };
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      user: data.user,
      session: data.session,
    };
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Get current user
  static async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Get all users (for superadmin)
  static async getAllUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createUser(userData: {
    email: string;
    full_name: string;
    role: UserRole;
    phone?: string;
    password?: string;
    sendPasswordEmail?: boolean;
  }) {
    if (!userData.password && !userData.sendPasswordEmail) {
      throw new Error("Either password or sendPasswordEmail must be provided");
    }

    const tempPassword = userData.password || this.generateSecurePassword();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: tempPassword,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
        },
        emailRedirectTo: undefined,
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          phone: userData.phone,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      if (userData.sendPasswordEmail && userData.email) {
        await this.sendPasswordEmail(userData.email, tempPassword);
      }

      return {
        ...profile,
        tempPassword: userData.sendPasswordEmail ? undefined : tempPassword,
      };
    }

    throw new Error("Failed to create user");
  }

  private static generateSecurePassword(): string {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  private static async sendPasswordEmail(
    email: string,
    password: string
  ): Promise<void> {
    console.log("Password email would be sent to:", email);
    console.log("Temporary password:", password);
    // TODO: Implement actual email sending via your email service
  }

  // Update user (for superadmin)
  static async updateUser(
    userId: string,
    updates: {
      full_name?: string;
      email?: string;
      role?: UserRole;
      phone?: string;
    }
  ) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete user (for superadmin)
  static async deleteUser(userId: string) {
    // First delete from auth (if needed)
    // Note: You may want to use admin API for this
    // For now, we'll just delete from profiles
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) throw error;
  }

  // Update user profile
  static async updateProfile(
    userId: string,
    updates: {
      full_name?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
    }
  ) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Change password
  static async changePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  }

  // Get user role
  static async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.role || null;
    } catch {
      return null;
    }
  }
}
