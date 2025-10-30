import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignUp, useSignOut } from "@/hooks/useAuthManagement";
import { getErrorMessage, ROUTES, delay } from "@/lib/utils";

// Sign in schema
const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SigninFormData = z.infer<typeof signinSchema>;

export const useSigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signInMutation = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      setError(null);
      await signInMutation.signInAsync({
        email: data.email,
        password: data.password,
      });

      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(getErrorMessage(err, "An error occurred during login"));
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    showPassword,
    setShowPassword,
    error,
    isSubmitting,
    isLoading: isSubmitting || signInMutation.isPending,
    errors,
  };
};

// Sign up schema
const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const useSignupForm = () => {
  const REDIRECT_DELAY = 2000;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signUpMutation = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      await signUpMutation.signUpAsync({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      await delay(REDIRECT_DELAY);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(getErrorMessage(err, "An error occurred during signup"));
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    error,
    isSubmitting,
    isLoading: isSubmitting || signUpMutation.isPending,
    errors,
  };
};

// Logout hook
export const useLogout = () => {
  const navigate = useNavigate();
  const signOutMutation = useSignOut();

  const logout = () => {
    signOutMutation.signOut({
      onSuccess: () => {
        navigate(ROUTES.LOGIN);
      },
    });
  };

  return { logout, isPending: signOutMutation.isPending };
};
