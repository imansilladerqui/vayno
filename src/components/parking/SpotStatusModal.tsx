import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { ParkingSpotWithLot } from "@/types";

interface SpotStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot: ParkingSpotWithLot;
  onUpdateStatus: (spotId: string, status: string) => void;
  isLoading?: boolean;
}

export const SpotStatusModal = ({
  open,
  onOpenChange,
  spot,
  onUpdateStatus,
  isLoading = false,
}: SpotStatusModalProps) => {
  const [newStatus, setNewStatus] = useState(spot.status || "available");

  useEffect(() => {
    if (open && spot) {
      setNewStatus(spot.status || "available");
    }
  }, [open, spot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(spot.id, newStatus);
  };

  const handleClose = () => {
    if (!isLoading) {
      setNewStatus(spot.status || "available");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Spot Status</DialogTitle>
          <DialogDescription>
            Change the status of spot {spot.spot_number}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newStatus}
              onValueChange={setNewStatus}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

