import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/lib/authService";
import { UserRole } from "@/types";
import { toast } from "sonner";

// Query keys - centralized for consistency
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: () => [...userQueryKeys.lists()] as const,
  detail: (id: string) => [...userQueryKeys.all, "detail", id] as const,
};

// Query to fetch all users
export const useAllUsers = () => {
  return useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: () => AuthService.getAllUsers(),
  });
};

// Query to fetch a single user
export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(userId!),
    queryFn: () => AuthService.getUserProfile(userId!),
    enabled: !!userId,
  });
};

// Mutation to create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      email: string;
      full_name: string;
      role: UserRole;
      phone?: string;
      password?: string;
      sendPasswordEmail?: boolean;
    }) => AuthService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

// Mutation to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: {
        full_name?: string;
        email?: string;
        role?: UserRole;
        phone?: string;
      };
    }) => AuthService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

// Mutation to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => AuthService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};
