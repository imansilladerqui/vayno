import { useModals } from "@/contexts/ModalContext";
import { CheckInModal } from "@/components/modals/CheckInModal";
import { ReservationModal } from "@/components/modals/ReservationModal";
import { createModalOnChange } from "@/lib/modalHelpers";

const ModalManager = () => {
  const { checkInModal, reservationModal } = useModals();

  return (
    <>
      {checkInModal.data && (
        <CheckInModal
          open={checkInModal.open}
          onOpenChange={createModalOnChange(checkInModal)}
          checkIn={checkInModal.data}
        />
      )}
      {reservationModal.data && (
        <ReservationModal
          open={reservationModal.open}
          onOpenChange={createModalOnChange(reservationModal)}
          reservation={reservationModal.data}
        />
      )}
    </>
  );
};

export { ModalManager };
