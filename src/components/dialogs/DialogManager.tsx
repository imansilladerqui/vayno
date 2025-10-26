import { useDialogs } from "@/contexts/DialogContext";
import { useDeleteUser } from "@/hooks/queries/useUserQueries";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { toast } from "sonner";

const DialogManager = () => {
  const { deleteUserDialog } = useDialogs();
  const deleteUser = useDeleteUser();

  const handleConfirmDelete = () => {
    const user = deleteUserDialog.selectedUser;
    if (!user) return;

    deleteUser.mutate(user.id, {
      onSuccess: () => {
        deleteUserDialog.setSelectedUser(null);
        deleteUserDialog.hide();
        toast.success("User deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete user");
      },
    });
  };

  return (
    <DeleteUserDialog
      open={deleteUserDialog.open}
      onCancel={() => {
        deleteUserDialog.setOpen(false);
        deleteUserDialog.setSelectedUser(null);
      }}
      onConfirm={handleConfirmDelete}
      selectedUser={deleteUserDialog.selectedUser}
    />
  );
};

export { DialogManager };
