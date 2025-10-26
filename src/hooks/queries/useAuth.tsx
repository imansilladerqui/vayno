import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/lib/authService";
import { toast } from "sonner";

export const useSignUp = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
      role,
    }: {
      email: string;
      password: string;
      fullName: string;
      role?: "customer" | "admin" | "superadmin";
    }) => AuthService.signUp(email, password, fullName, role),
    onSuccess: () => {
      // AuthContext handles auth state automatically
      toast.success("Account Created", {
        description: "Please check your email to verify your account.",
      });
    },
    onError: (error) => {
      toast.error("Sign Up Failed", {
        description:
          error.message || "Unable to create your account. Please try again.",
      });
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.signIn(email, password),
    onSuccess: () => {
      // AuthContext handles auth state automatically
      toast.success("Welcome Back!", {
        description: "You've been successfully signed in.",
      });
    },
    onError: (error) => {
      toast.error("Sign In Failed", {
        description:
          error.message || "Invalid email or password. Please try again.",
      });
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: AuthService.signOut,
    onSuccess: () => {
      // AuthContext handles auth state automatically
      toast.success("Signed Out", {
        description: "You've been successfully signed out.",
      });
    },
    onError: (error) => {
      toast.error("Sign Out Failed", {
        description: error.message || "Unable to sign out. Please try again.",
      });
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Record<string, unknown>;
    }) => AuthService.updateProfile(userId, updates),
    onSuccess: () => {
      // AuthContext handles auth state automatically
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Update Failed", {
        description:
          error.message || "Unable to update profile. Please try again.",
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      toast.success("Password Changed", {
        description: "Your password has been changed successfully.",
      });
    },
    onError: (error) => {
      toast.error("Password Change Failed", {
        description:
          error.message || "Unable to change password. Please try again.",
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      toast.success("Reset Email Sent", {
        description: "Check your email for password reset instructions.",
      });
    },
    onError: (error) => {
      toast.error("Reset Failed", {
        description:
          error.message || "Unable to send reset email. Please try again.",
      });
    },
  });
};
