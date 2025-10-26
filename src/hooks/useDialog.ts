import { useState, useCallback } from "react";

interface UseDialogReturn {
  open: boolean;
  message: string;
  setMessage: (msg: string) => void;
  setOpen: (open: boolean) => void;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export const useDialog = (
  initialOpen = false,
  initialMessage = ""
): UseDialogReturn => {
  const [open, setOpen] = useState(initialOpen);
  const [message, setMessage] = useState(initialMessage);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const updateMessage = useCallback((msg: string) => setMessage(msg), []);

  return {
    open,
    message,
    setMessage: updateMessage,
    setOpen,
    show,
    hide,
    toggle,
  };
};
