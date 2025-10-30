import { useState } from "react";
import type { Profile } from "@/types";
import type { Business } from "@/hooks/queries/useBusinessQueries";
import { useDialog } from "@/hooks/useDialog";
import { DialogContext } from "@/contexts/DialogContext";

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const userDialog = useDialog();
  const businessDialog = useDialog();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );

  const deleteUserDialog = {
    ...userDialog,
    selectedUser,
    setSelectedUser,
  };

  const deleteBusinessDialog = {
    ...businessDialog,
    selectedBusiness,
    setSelectedBusiness,
  };

  return (
    <DialogContext.Provider
      value={{
        deleteUserDialog,
        deleteBusinessDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
