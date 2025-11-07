import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParkingReservationForm } from "@/hooks/useParkingReservationForm";
import { format } from "date-fns";
import { useParkingSpotManagement } from "@/hooks/useParkingSpotManagement";
import { useModals } from "@/contexts/ModalContext";
import { closeModal } from "@/lib/modalHelpers";
import type { ParkingSpotData } from "@/types";

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: ParkingSpotData;
}

export const ReservationModal = ({
  open,
  onOpenChange,
  reservation,
}: ReservationModalProps) => {
  const { reservationModal } = useModals();
  const {
    reservation: reservationData,
    handleCreateReservation,
    isCreatingReservation,
    spotHourlyRate,
  } = useParkingSpotManagement(reservation.spot_id);

  const {
    startDate,
    startTime,
    vehiclePlate,
    vehicleType,
    customerName,
    customerPhone,
    customerEmail,
    setStartDate,
    setStartTime,
    setVehiclePlate,
    setVehicleType,
    setCustomerName,
    setCustomerPhone,
    setCustomerEmail,
    handleSubmit,
    resetForm,
    timeSlots,
    isValid,
  } = useParkingReservationForm({
    open,
    onSubmit: (data) =>
      handleCreateReservation(
        { ...data, spotId: reservationData?.spot_id || "" },
        {
          onSuccess: () => closeModal(reservationModal),
        }
      ),
  });

  const handleClose = () => {
    if (!isCreatingReservation) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Reserve Spot #{reservationData?.parking_spots?.spot_number || "N/A"}
          </DialogTitle>
          <DialogDescription>
            Reserve this parking spot. You'll be charged per hour based on when
            you check out.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Reservation Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                required
                disabled={isCreatingReservation}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Reservation Time *</Label>
              <Select
                value={startTime}
                onValueChange={setStartTime}
                required
                disabled={isCreatingReservation}
              >
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Time slots available in 15-minute intervals
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehiclePlate">Vehicle Plate Number *</Label>
            <Input
              id="vehiclePlate"
              placeholder="ABC-1234"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              required
              disabled={isCreatingReservation}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={vehicleType}
              onValueChange={(value) =>
                setVehicleType(value as typeof vehicleType)
              }
              disabled={isCreatingReservation}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Consumer Name (Optional)</Label>
            <Input
              id="customerName"
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isCreatingReservation}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Consumer Phone (Optional)</Label>
              <Input
                id="customerPhone"
                placeholder="555-0123"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                disabled={isCreatingReservation}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Consumer Email (Optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="john@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                disabled={isCreatingReservation}
              />
            </div>
          </div>

          {spotHourlyRate > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Hourly Rate:
                </span>
                <span className="font-bold text-lg">
                  ${spotHourlyRate.toFixed(2)}/hour
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You'll be charged based on the duration from check-in to
                check-out.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreatingReservation}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingReservation || !isValid}>
              Reserve Spot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
