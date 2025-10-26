import { useState } from "react";
import type { ParkingSpot, ParkingSession } from "@/types";
import {
  useParkingSpots,
  useActiveSessions,
  useCheckInVehicle,
  useCheckOutVehicle,
  useUpdateParkingSpot,
} from "@/hooks/queries/useParking";

/**
 * Hook for managing parking operations throughout the application
 * Provides a unified API for parking lot and spot operations
 */
export const useParkingManagement = () => {
  // State for dialogs
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedSession, setSelectedSession] = useState<ParkingSession | null>(
    null
  );
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  // Data queries
  const parkingSpotsQuery = useParkingSpots();
  const activeSessionsQuery = useActiveSessions();

  // Mutations
  const checkInMutation = useCheckInVehicle();
  const checkOutMutation = useCheckOutVehicle();
  const updateSpotMutation = useUpdateParkingSpot();

  // Check in vehicle
  const checkInVehicle = (
    spotId: string,
    vehiclePlate: string,
    userId?: string,
    vehicleType: "car" | "motorcycle" | "truck" | "van" | "other" = "car"
  ) => {
    return checkInMutation.mutateAsync(
      { spotId, vehiclePlate, userId, vehicleType },
      {
        onSuccess: () => {
          setIsCheckInOpen(false);
          setSelectedSpot(null);
        },
      }
    );
  };

  // Check out vehicle
  const checkOutVehicle = (sessionId: string, paymentMethod = "cash") => {
    return checkOutMutation.mutateAsync(
      { sessionId, paymentMethod },
      {
        onSuccess: () => {
          setIsCheckOutOpen(false);
          setSelectedSession(null);
        },
      }
    );
  };

  // Update parking spot status
  const updateSpotStatus = (
    spotId: string,
    status: "available" | "occupied" | "reserved" | "maintenance"
  ) => {
    updateSpotMutation.mutate({
      id: spotId,
      updates: { status },
    });
  };

  // Open check-in dialog
  const openCheckIn = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setIsCheckInOpen(true);
  };

  // Open check-out dialog
  const openCheckOut = (session: ParkingSession) => {
    setSelectedSession(session);
    setIsCheckOutOpen(true);
  };

  return {
    // Data
    parkingSpots: parkingSpotsQuery.data,
    activeSessions: activeSessionsQuery.data,
    isLoading: parkingSpotsQuery.isLoading || activeSessionsQuery.isLoading,
    error: parkingSpotsQuery.error || activeSessionsQuery.error,

    // Dialog state
    selectedSpot,
    selectedSession,
    isCheckInOpen,
    isCheckOutOpen,
    setIsCheckInOpen,
    setIsCheckOutOpen,

    // Actions
    checkInVehicle,
    checkOutVehicle,
    updateSpotStatus,
    openCheckIn,
    openCheckOut,

    // Status
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    isUpdatingSpot: updateSpotMutation.isPending,
  };
};
