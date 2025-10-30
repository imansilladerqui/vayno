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

interface DeleteEntityDialogProps<T> {
  open: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  entity?: T | null;
  /**
   * Function to extract the display name from the entity
   */
  getDisplayName: (entity: T) => string;
  /**
   * The entity type name for fallback text (e.g., "user", "business")
   */
  entityType: string;
}

/**
 * Generic delete confirmation dialog component
 * Can be used for any entity type by providing the entity,
 * a function to get its display name, and the entity type name
 */
export function DeleteEntityDialog<T>({
  open,
  onCancel,
  onConfirm,
  entity,
  getDisplayName,
  entityType,
}: DeleteEntityDialogProps<T>) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const displayName = entity ? getDisplayName(entity) : `this ${entityType}`;

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{displayName}</strong>. This
            action cannot be undone.
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
}
