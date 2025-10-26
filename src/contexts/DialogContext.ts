import { createContext, useContext } from "react";
import type { Profile } from "@/types";

interface UseDialogReturn {
  open: boolean;
  message: string;
  setMessage: (msg: string) => void;
  setOpen: (open: boolean) => void;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

interface DeleteUserDialogType extends UseDialogReturn {
  selectedUser: Profile | null;
  setSelectedUser: (user: Profile | null) => void;
}

interface DialogContextType {
  deleteUserDialog: DeleteUserDialogType;
  [key: string]: DeleteUserDialogType | UseDialogReturn | object;
}

export const DialogContext = createContext<DialogContextType | null>(null);

export const useDialogs = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialogs must be used within DialogProvider");
  return ctx;
};
