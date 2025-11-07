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
import { useParkingCheckinForm } from "@/hooks/useParkingCheckinForm";
import { useParkingSpotManagement } from "@/hooks/useParkingSpotManagement";
import type { ParkingSpotData, VehicleCheckInFormData } from "@/types";

interface CheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkIn: ParkingSpotData;
}

export const CheckInModal = ({
  open,
  onOpenChange,
  checkIn,
}: CheckInModalProps) => {
  const { parkingSpot, checkInSession, isCheckingIn, spotHourlyRate } =
    useParkingSpotManagement(checkIn.parking_spots.id);

  const handleCheckIn = (data: VehicleCheckInFormData) => {
    checkInSession(data, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const {
    vehiclePlate,
    vehicleType,
    customerName,
    customerPhone,
    customerEmail,
    setVehiclePlate,
    setVehicleType,
    setCustomerName,
    setCustomerPhone,
    setCustomerEmail,
    handleSubmit,
    resetForm,
    isValid,
  } = useParkingCheckinForm({
    open,
    onSubmit: handleCheckIn,
  });

  const handleClose = () => {
    if (!isCheckingIn) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Check In Vehicle</DialogTitle>
          <DialogDescription>
            Park a vehicle in spot {parkingSpot?.parking_spots.spot_number}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehiclePlate">Vehicle Plate Number *</Label>
            <Input
              id="vehiclePlate"
              placeholder="ABC-1234"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              required
              disabled={isCheckingIn}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={vehicleType}
              onValueChange={(value) =>
                setVehicleType(value as typeof vehicleType)
              }
              disabled={isCheckingIn}
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
              disabled={isCheckingIn}
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
                disabled={isCheckingIn}
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
                disabled={isCheckingIn}
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
              disabled={isCheckingIn}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCheckingIn || !isValid}>
              Check In
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
