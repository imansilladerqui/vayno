import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { delay, getErrorMessage } from "@/lib/utils";
import {
  useSignUp as useSignUpQuery,
  useSignIn as useSignInQuery,
  useSignOut as useSignOutQuery,
} from "@/hooks/queries/useAuthQueries";

export const useSignUp = () => {
  const signUpMutation = useSignUpQuery();

  const signUp = (
    variables: {
      email: string;
      password: string;
      fullName: string;
      role?: "user" | "admin" | "superadmin";
    },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    signUpMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Account Created", {
          description: "Please check your email to verify your account.",
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Sign Up Failed", {
          description:
            error.message || "Unable to create your account. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const signUpAsync = async (variables: {
    email: string;
    password: string;
    fullName: string;
    role?: "user" | "admin" | "superadmin";
  }) => {
    try {
      const result = await signUpMutation.mutateAsync(variables);
      toast.success("Account Created", {
        description: "Please check your email to verify your account.",
      });
      return result;
    } catch (error) {
      toast.error("Sign Up Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.",
      });
      throw error;
    }
  };

  return {
    ...signUpMutation,
    signUp,
    signUpAsync,
    mutate: signUpMutation.mutate,
    mutateAsync: signUpAsync,
  };
};

export const useSignIn = () => {
  const signInMutation = useSignInQuery();

  const signIn = (
    variables: { email: string; password: string },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    signInMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Welcome Back!", {
          description: "You've been successfully signed in.",
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Sign In Failed", {
          description:
            error.message || "Invalid email or password. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const signInAsync = async (variables: {
    email: string;
    password: string;
  }) => {
    try {
      const result = await signInMutation.mutateAsync(variables);

      // Verify session was created
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          getErrorMessage(sessionError, "Failed to retrieve session")
        );
      }

      // Retry session check if not immediately available
      if (!session) {
        await delay(500);
        const {
          data: { session: retrySession },
        } = await supabase.auth.getSession();
        if (!retrySession) {
          throw new Error("Session was not created. Please try again.");
        }
      }

      toast.success("Welcome Back!", {
        description: "You've been successfully signed in.",
      });

      return result;
    } catch (error) {
      toast.error("Sign In Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Invalid email or password. Please try again.",
      });
      throw error;
    }
  };

  return {
    ...signInMutation,
    signIn,
    signInAsync,
    mutate: signInMutation.mutate,
    mutateAsync: signInAsync,
  };
};

export const useSignOut = () => {
  const signOutMutation = useSignOutQuery();

  const signOut = (options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Signed Out", {
          description: "You've been successfully signed out.",
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Sign Out Failed", {
          description: error.message || "Unable to sign out. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  return {
    ...signOutMutation,
    signOut,
    mutate: signOutMutation.mutate,
    mutateAsync: signOutMutation.mutateAsync,
  };
};
