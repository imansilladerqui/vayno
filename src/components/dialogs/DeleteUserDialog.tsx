import type { Profile } from "@/types";
import { DeleteEntityDialog } from "./DeleteEntityDialog";

interface DeleteUserDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  selectedUser?: Profile | null;
}

export const DeleteUserDialog = ({
  open,
  onCancel,
  onConfirm,
  selectedUser,
}: DeleteUserDialogProps) => {
  return (
    <DeleteEntityDialog
      open={open}
      onCancel={onCancel}
      onConfirm={onConfirm}
      entity={selectedUser}
      getDisplayName={(user) => user.full_name || user.email || "user"}
      entityType="user"
    />
  );
};
