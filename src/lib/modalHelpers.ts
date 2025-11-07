import { createFarFutureDate } from "@/lib/utils";

export const createModalOnChange = <T>(modal: {
  open: boolean;
  setOpen: (open: boolean) => void;
  hide: () => void;
  setData: (data: T | null) => void;
}) => {
  return (open: boolean) => {
    if (!open) {
      closeModal(modal);
    } else {
      modal.setOpen(open);
    }
  };
};

export const closeModal = <T>(modal: {
  setData: (data: T | null) => void;
  hide: () => void;
}) => {
  modal.setData(null);
  modal.hide();
};

export { createFarFutureDate };
