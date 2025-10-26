import { useState } from "react";
import type { Profile } from "@/types";
import { useDialog } from "@/hooks/useDialog";
import { DialogContext } from "@/contexts/DialogContext";

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const dialog = useDialog();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const deleteUserDialog = {
    ...dialog,
    selectedUser,
    setSelectedUser,
  };

  return (
    <DialogContext.Provider
      value={{
        deleteUserDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
