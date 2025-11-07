import { useState, useCallback } from "react";

interface UseDialogReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  show: () => void;
  hide: () => void;
}

export const useDialog = (initialOpen = false): UseDialogReturn => {
  const [open, setOpen] = useState(initialOpen);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return {
    open,
    setOpen,
    show,
    hide,
  };
};
