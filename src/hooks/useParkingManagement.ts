import { toast } from "sonner";
import {
  useParkingSpots,
  useActiveSessions,
  useCheckInVehicle,
  useCheckOutVehicle,
  useUpdateParkingSpot,
  useParkingLots,
  useCreateParkingLot,
  useUpdateParkingLot,
  useCreateParkingSpots,
  useCalculateCurrentCost,
  useActivityLogs,
} from "@/hooks/queries/useParkingQueries";
import type {
  ParkingLotInsert,
  ParkingLotUpdate,
  ParkingSpotInsert,
  ParkingSpotUpdate,
} from "@/types";

type ParkingManagementOptions = {
  includeSpots?: boolean;
  includeActiveSessions?: boolean;
  includeParkingLots?: boolean;
  includeActivities?: boolean;
};

export const useParkingManagement = (options: ParkingManagementOptions = {}) => {
  const {
    includeSpots = true,
    includeActiveSessions = true,
    includeParkingLots = true,
    includeActivities = true,
  } = options;

  const parkingSpotsQuery = includeSpots ? useParkingSpots() : ({} as any);
  const activeSessionsQuery = includeActiveSessions
    ? useActiveSessions()
    : ({} as any);
  const checkInMutation = useCheckInVehicle();
  const checkOutMutation = useCheckOutVehicle();
  const updateSpotMutation = useUpdateParkingSpot();
  const parkingLotsQuery = includeParkingLots ? useParkingLots() : ({} as any);
  const createParkingLotMutation = useCreateParkingLot();
  const updateParkingLotMutation = useUpdateParkingLot();
  const createParkingSpotsMutation = useCreateParkingSpots();
  const calculateCostMutation = useCalculateCurrentCost();
  const activitiesQuery = includeActivities ? useActivityLogs() : ({} as any);

  const occupancyStats = (() => {
    const spots = (parkingSpotsQuery.data as unknown[]) || [];
    const counts = spots.reduce(
      (acc: Record<string, number>, spot) => {
        const status = (spot as { status?: string }).status;
        if (status) acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    const total = spots.length;
    const occupied = counts["occupied"] || 0;
    const reserved = counts["reserved"] || 0;
    const available = counts["available"] || 0;
    const maintenance = counts["maintenance"] || 0;

    return {
      total,
      available,
      occupied,
      reserved,
      maintenance,
      occupancyPercentage: total > 0 ? Math.round((occupied / total) * 100) : 0,
    };
  })();

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

  const createParkingLot = (
    variables: ParkingLotInsert,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    createParkingLotMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Parking Lot Created", {
          description: "Parking lot has been created successfully.",
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Creation Failed", {
          description:
            error.message || "Failed to create parking lot. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const updateParkingLot = (
    variables: { id: string; updates: ParkingLotUpdate },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    updateParkingLotMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Parking Lot Updated", {
          description: "Parking lot has been updated successfully.",
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Update Failed", {
          description:
            error.message || "Failed to update parking lot. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const createParkingSpots = (
    variables: ParkingSpotInsert[],
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    createParkingSpotsMutation.mutate(variables, {
      onSuccess: () => {
        toast.success("Parking Spots Created", {
          description: `${variables.length} parking spot(s) have been created successfully.`,
        });
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error("Creation Failed", {
          description:
            error.message ||
            "Failed to create parking spots. Please try again.",
        });
        options?.onError?.(error);
      },
    });
  };

  const calculateCurrentCost = async (sessionId: string) => {
    try {
      const result = await calculateCostMutation.mutateAsync(sessionId);
      return result;
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

  return {
    parkingSpots: parkingSpotsQuery.data,
    activeSessions: activeSessionsQuery.data,
    parkingLots: parkingLotsQuery.data,
    occupancyStats,
    activities: activitiesQuery.data,

    isLoadingSpots: parkingSpotsQuery.isLoading,
    isLoadingSessions: activeSessionsQuery.isLoading,
    isLoadingLots: parkingLotsQuery.isLoading,
    // derived occupancy has no extra loading
    isLoadingActivities: activitiesQuery.isLoading,

    spotsError: parkingSpotsQuery.error,
    sessionsError: activeSessionsQuery.error,
    lotsError: parkingLotsQuery.error,
    activitiesError: activitiesQuery.error,

    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    isUpdatingSpot: updateSpotMutation.isPending,
    isCreatingLot: createParkingLotMutation.isPending,
    isUpdatingLot: updateParkingLotMutation.isPending,
    isCreatingSpots: createParkingSpotsMutation.isPending,
    isCalculatingCost: calculateCostMutation.isPending,

    checkIn,
    checkOut,
    updateSpot,
    createParkingLot,
    updateParkingLot,
    createParkingSpots,
    calculateCurrentCost,

    checkInMutation,
    checkOutMutation,
    updateSpotMutation,
    createParkingLotMutation,
    updateParkingLotMutation,
    createParkingSpotsMutation,
    calculateCostMutation,
  };
};
