import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Profile } from "@/types";

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
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <strong>
              {selectedUser?.full_name || selectedUser?.email || "this user"}
            </strong>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
