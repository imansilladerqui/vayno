import { useDialogs } from "@/contexts/DialogContext";
import { useDeleteUser } from "@/hooks/queries/useUserQueries";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { DeleteBusinessDialog } from "./DeleteBusinessDialog";

const DialogManager = () => {
  const { deleteUserDialog, deleteBusinessDialog } = useDialogs();
  const deleteUser = useDeleteUser();
  const { confirmDeleteBusiness } = useBusinessManagement();

  const handleConfirmDeleteUser = () => {
    const user = deleteUserDialog.selectedUser;
    if (!user) return;

    deleteUser.mutate(user.id, {
      onSuccess: () => {
        deleteUserDialog.setSelectedUser(null);
        deleteUserDialog.hide();
      },
    });
  };

  const handleConfirmDeleteBusiness = () => {
    const business = deleteBusinessDialog.selectedBusiness;
    if (!business) return;

    confirmDeleteBusiness(business.id);
  };

  return (
    <>
      <DeleteUserDialog
        open={deleteUserDialog.open}
        onCancel={() => {
          deleteUserDialog.setOpen(false);
          deleteUserDialog.setSelectedUser(null);
        }}
        onConfirm={handleConfirmDeleteUser}
        selectedUser={deleteUserDialog.selectedUser}
      />
      <DeleteBusinessDialog
        open={deleteBusinessDialog.open}
        onCancel={() => {
          deleteBusinessDialog.setOpen(false);
          deleteBusinessDialog.setSelectedBusiness(null);
        }}
        onConfirm={handleConfirmDeleteBusiness}
        selectedBusiness={deleteBusinessDialog.selectedBusiness}
      />
    </>
  );
};

export { DialogManager };
