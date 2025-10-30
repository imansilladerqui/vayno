import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAllUsers, useUpdateUser } from "@/hooks/queries/useUserQueries";
import { useDialogs } from "@/contexts/DialogContext";
import type { Profile, UserRole } from "@/types";

export const userSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin", "superadmin"] as [UserRole, ...UserRole[]]),
  business_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userSchema>;

type UserUpdateData = {
  full_name?: string;
  email?: string;
  role?: UserRole;
  phone?: string;
  business_id?: string | null;
  is_active?: boolean;
};

export const useUserManagement = () => {
  const navigate = useNavigate();
  const { deleteUserDialog } = useDialogs();
  const allUsersQuery = useAllUsers();
  const updateUserMutation = useUpdateUser();

  const editUser = (user: Profile) => {
    navigate(`/users/${user.id}/edit`);
  };

  const deleteUser = (user: Profile) => {
    deleteUserDialog.setSelectedUser(user);
    deleteUserDialog.show();
  };

  const updateUser = (userId: string, data: UserUpdateData) => {
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
    users: allUsersQuery.data,
    isLoading: allUsersQuery.isLoading,
    error: allUsersQuery.error,
    editUser,
    deleteUser,
    updateUser,
    isUpdating: updateUserMutation.isPending,
  };
};
