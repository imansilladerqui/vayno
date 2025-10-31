import { toast } from "sonner";
import {
  useParkingSpots,
  useCheckInVehicle,
  useCheckOutVehicle,
  useUpdateParkingSpot,
  useCalculateCurrentCost,
} from "@/hooks/queries/useParkingQueries";
import type { ParkingSpotUpdate } from "@/types";
import { formatDurationMsToHoursAndMinutes } from "@/lib/utils";

export const useParkingManagement = (businessId?: string) => {
  const { data: parkingSpots } = useParkingSpots(businessId);
  const checkInMutation = useCheckInVehicle();
  const checkOutMutation = useCheckOutVehicle();
  const updateSpotMutation = useUpdateParkingSpot();
  const calculateCostMutation = useCalculateCurrentCost();

  const counts = (parkingSpots ?? []).reduce(
    (acc: Record<string, number>, spot) => {
      const status = (spot as { status?: string }).status;
      if (status) acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalSpots = parkingSpots?.length || 0;
  const occupiedSpots = counts["occupied"] || 0;
  const reservedSpots = counts["reserved"] || 0;
  const availableSpots = counts["available"] || 0;
  const maintenanceSpots = counts["maintenance"] || 0;
  const rate =
    totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0;

  const checkIn = (
    variables: {
      spotId: string;
      vehiclePlate: string;
      userId?: string;
      vehicleType?: "car" | "motorcycle" | "truck" | "van" | "other";
    },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    checkInMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Vehicle Checked In", {
          description: `Vehicle ${variables.vehiclePlate} has been checked in successfully.`,
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Check In Failed", {
          description:
            error.message || "Failed to check in vehicle. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const checkOut = (
    variables: { sessionId: string; paymentMethod?: string },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    checkOutMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Vehicle Checked Out", {
          description: "Vehicle has been checked out successfully.",
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Check Out Failed", {
          description:
            error.message || "Failed to check out vehicle. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const updateSpot = (
    variables: { id: string; updates: Partial<ParkingSpotUpdate> },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    updateSpotMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Spot Updated", {
          description: "Parking spot has been updated successfully.",
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Update Failed", {
          description:
            error.message || "Failed to update parking spot. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const calculateCurrentCost = async (sessionId: string) => {
    try {
      const result = await calculateCostMutation.mutateAsync(sessionId);
      return {
        ...result,
        duration: formatDurationMsToHoursAndMinutes(result.durationMs),
      };
    } catch (error) {
      toast.error("Calculation Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to calculate current cost. Please try again.",
      });
      throw error;
    }
  };

  const statusCounts = (parkingSpots ?? []).reduce<Record<string, number>>(
    (acc, spot) => {
      const status = spot.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    parkingSpots,
    totalSpots,
    rate,
    reservedSpots,
    maintenanceSpots,
    availableSpots,
    occupiedSpots,
    statusCounts,

    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    isUpdatingSpot: updateSpotMutation.isPending,

    checkIn,
    checkOut,
    updateSpot,
    calculateCurrentCost,
  };
};
