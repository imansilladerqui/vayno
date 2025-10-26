import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAllUsers, useUpdateUser } from "@/hooks/queries/useUserQueries";
import { useDialogs } from "@/contexts/DialogContext";
import type { Profile, UserRole } from "@/types";

// User Form Schema
export const userSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["customer", "admin", "superadmin"] as [
    UserRole,
    ...UserRole[]
  ]),
});

export type UserFormData = z.infer<typeof userSchema>;

/**
 * Hook for managing users throughout the application
 * Provides a unified API for user operations
 */
export const useUserManagement = () => {
  const navigate = useNavigate();
  const { deleteUserDialog } = useDialogs();

  // Data queries
  const allUsersQuery = useAllUsers();
  const updateUserMutation = useUpdateUser();

  // Note: For getting a single user profile, components should use useUserProfile directly
  // or pass the ID as a parameter to this hook

  // Navigate to edit user
  const editUser = (user: Profile) => {
    navigate(`/users/${user.id}/edit`);
  };

  // Open delete confirmation dialog
  const deleteUser = (user: Profile) => {
    deleteUserDialog.setSelectedUser(user);
    deleteUserDialog.show();
  };

  // Update user (for edit form)
  const updateUser = (
    userId: string,
    data: {
      full_name?: string;
      email?: string;
      role?: UserRole;
      phone?: string;
    }
  ) => {
    updateUserMutation.mutate(
      { userId, data },
      {
        onSuccess: () => {
          navigate("/users");
        },
      }
    );
  };

  return {
    // Data
    users: allUsersQuery.data,
    isLoading: allUsersQuery.isLoading,
    error: allUsersQuery.error,

    // Actions
    editUser,
    deleteUser,
    updateUser,

    // Status
    isUpdating: updateUserMutation.isPending,
  };
};
