import type { Business } from "@/hooks/queries/useBusinessQueries";
import { DeleteEntityDialog } from "./DeleteEntityDialog";

interface DeleteBusinessDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  selectedBusiness?: Business | null;
}

export const DeleteBusinessDialog = ({
  open,
  onCancel,
  onConfirm,
  selectedBusiness,
}: DeleteBusinessDialogProps) => {
  return (
    <DeleteEntityDialog
      open={open}
      onCancel={onCancel}
      onConfirm={onConfirm}
      entity={selectedBusiness}
      getDisplayName={(business) => business.name}
      entityType="business"
    />
  );
};
