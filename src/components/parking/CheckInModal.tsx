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
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spotId: string;
  spotNumber: number;
  onCheckIn: (data: {
    spotId: string;
    vehiclePlate: string;
    vehicleType?: "car" | "motorcycle" | "truck" | "van" | "other";
    userId?: string;
  }) => void;
  isLoading?: boolean;
}

export const CheckInModal = ({
  open,
  onOpenChange,
  spotId,
  spotNumber,
  onCheckIn,
  isLoading = false,
}: CheckInModalProps) => {
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleType, setVehicleType] = useState<
    "car" | "motorcycle" | "truck" | "van" | "other"
  >("car");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiclePlate.trim()) return;

    onCheckIn({
      spotId,
      vehiclePlate: vehiclePlate.trim(),
      vehicleType,
    });

    // Reset form
    setVehiclePlate("");
    setVehicleType("car");
  };

  const handleClose = () => {
    if (!isLoading) {
      setVehiclePlate("");
      setVehicleType("car");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check In Vehicle</DialogTitle>
          <DialogDescription>
            Park a vehicle in spot {spotNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehiclePlate">Vehicle Plate Number</Label>
            <Input
              id="vehiclePlate"
              placeholder="ABC-123"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={vehicleType}
              onValueChange={(value: any) => setVehicleType(value)}
              disabled={isLoading}
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
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !vehiclePlate.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check In
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

