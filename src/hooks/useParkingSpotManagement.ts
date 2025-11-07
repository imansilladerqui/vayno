import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useCheckInVehicleQuery,
  useCheckOutVehicleQuery,
  useParkingSessionQuery,
} from "@/hooks/queries/useParkingQueries";
import {
  useCreateReservationQuery,
  useCancelReservationQuery,
  useSpotReservationQuery,
} from "@/hooks/queries/useReservationQueries";
import type { ReservationInsert, VehicleCheckInFormData } from "@/types";
import {
  formatDurationMsToHoursAndMinutes,
  formatTimeDifference,
  normalizeCustomerInfo,
  createFarFutureDate,
} from "@/lib/utils";

export const useParkingSpotManagement = (spotId?: string) => {
  // ---------------------------------------------------------------------------
  // Remote Mutations & Queries
  // ---------------------------------------------------------------------------
  const checkInMutation = useCheckInVehicleQuery();
  const checkOutMutation = useCheckOutVehicleQuery();
  const { data: parkingSpot, isFetching: parkingSpotFetching } =
    useParkingSessionQuery(spotId);
  const { data: reservation } = useSpotReservationQuery(spotId);
  const createReservationMutation = useCreateReservationQuery();
  const cancelReservationMutation = useCancelReservationQuery();

  // ---------------------------------------------------------------------------
  // Derived Session State
  // ---------------------------------------------------------------------------
  const [calculatedSessionCost, setCalculatedSessionCost] = useState<{
    total: number;
    duration: string;
  } | null>(null);

  const checkInTime = useMemo(() => {
    return new Date(parkingSpot?.check_in_time || "");
  }, [parkingSpot?.check_in_time]);

  const timeSinceCheckIn = useMemo(() => {
    return formatTimeDifference(new Date(parkingSpot?.check_in_time || ""));
  }, [parkingSpot?.check_in_time]);

  const spotHourlyRate = parkingSpot?.hourly_rate || 0;
  const spotDailyRate = parkingSpot?.daily_rate || 0;
  const spotMonthlyRate = parkingSpot?.monthly_rate || 0;

  // ---------------------------------------------------------------------------
  // Session Cost Helpers
  // ---------------------------------------------------------------------------
  const calculateSessionCost = useCallback(async () => {
    const checkInTimestamp = parkingSpot?.check_in_time;
    const hourlyRate = parkingSpot?.hourly_rate;

    if (!checkInTimestamp || hourlyRate == null) {
      setCalculatedSessionCost(null);
      return null;
    }

    const checkInDate = new Date(checkInTimestamp);
    const now = new Date();
    const diffMs = now.getTime() - checkInDate.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    const total = Math.ceil(Math.max(hours, 0)) * hourlyRate;
    const formatted = {
      total,
      duration: formatDurationMsToHoursAndMinutes(diffMs),
    };
    setCalculatedSessionCost(formatted);
    return formatted;
  }, [parkingSpot?.check_in_time, parkingSpot?.hourly_rate]);

  // ---------------------------------------------------------------------------
  // Check-In / Check-Out Operations
  // ---------------------------------------------------------------------------
  const checkInSession = useCallback(
    (
      data: {
        vehiclePlate: string;
        vehicleType: "car" | "motorcycle" | "truck" | "van" | "other";
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
      },
      options?: { onSuccess?: () => void; onError?: (error: Error) => void }
    ) => {
      if (!spotId) {
        options?.onError?.(new Error("Spot ID is required to check in."));
        return;
      }

      checkInMutation.mutate(
        {
          spotId,
          vehiclePlate: data.vehiclePlate,
          vehicleType: data.vehicleType,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
        },
        {
          onSuccess: () => {
            toast.success("Vehicle Checked In", {
              description: `Vehicle ${data.vehiclePlate} has been checked in successfully.`,
            });
            options?.onSuccess?.();
          },
          onError: (error: Error) => {
            toast.error("Check In Failed", {
              description:
                error.message ||
                "Failed to check in vehicle. Please try again.",
            });
            options?.onError?.(error);
          },
        }
      );
    },
    [spotId, checkInMutation]
  );

  const checkOut = useCallback(
    (
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
    },
    [checkOutMutation]
  );

  const checkOutSession = useCallback(
    (
      sessionId: string,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void }
    ) => {
      checkOut(
        { sessionId },
        {
          onSuccess: () => {
            options?.onSuccess?.();
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        }
      );
    },
    [checkOut]
  );

  // ---------------------------------------------------------------------------
  // Reservation Management
  // ---------------------------------------------------------------------------
  const createReservation = useCallback(
    (
      data: ReservationInsert & {
        customer_name?: string;
        customer_phone?: string;
        customer_email?: string;
        vehicle_plate?: string;
      },
      options?: { onSuccess?: () => void; onError?: (error: Error) => void }
    ) => {
      createReservationMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Reservation Created", {
            description: "Spot has been reserved successfully.",
          });
          options?.onSuccess?.();
        },
        onError: (error: Error) => {
          toast.error("Reservation Failed", {
            description:
              error.message ||
              "Failed to create reservation. Please try again.",
          });
          options?.onError?.(error);
        },
      });
    },
    [createReservationMutation]
  );

  const cancelReservation = useCallback(
    (
      reservationId: string,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void }
    ) => {
      cancelReservationMutation.mutate(reservationId, {
        onSuccess: () => {
          toast.success("Reservation Cancelled", {
            description: "Reservation has been cancelled successfully.",
          });
          options?.onSuccess?.();
        },
        onError: (error: Error) => {
          toast.error("Cancellation Failed", {
            description:
              error.message ||
              "Failed to cancel reservation. Please try again.",
          });
          options?.onError?.(error);
        },
      });
    },
    [cancelReservationMutation]
  );

  const handleCreateReservation = useCallback(
    (
      data: VehicleCheckInFormData & { spotId: string },
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      if (!data.startTime || !data.spotId) return;

      const customerInfo = normalizeCustomerInfo({
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      });

      createReservation(
        {
          spot_id: data.spotId,
          start_time: data.startTime,
          end_time: createFarFutureDate(new Date(data.startTime)).toISOString(),
          status: "pending",
          vehicle_plate: data.vehiclePlate,
          customer_name: customerInfo.customer_name || undefined,
          customer_email: customerInfo.customer_email || undefined,
          customer_phone: customerInfo.customer_phone || undefined,
        },
        {
          onSuccess: () => {
            options?.onSuccess?.();
          },
          onError: options?.onError,
        }
      );
    },
    [createReservation]
  );

  const handleCancelReservation = useCallback(
    (
      reservationId: string,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      cancelReservation(reservationId, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: options?.onError,
      });
    },
    [cancelReservation]
  );

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  return {
    // session cost helpers
    calculateSessionCost,
    calculatedSessionCost,

    // check-in/out operations
    checkInSession,
    checkOutSession,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,

    // reservation management
    createReservation,
    handleCreateReservation,
    handleCancelReservation,
    isCreatingReservation: createReservationMutation.isPending,
    isCancellingReservation: cancelReservationMutation.isPending,

    // derived session data
    spotHourlyRate,
    spotDailyRate,
    spotMonthlyRate,
    timeSinceCheckIn,
    checkInTime,
    parkingSpot,
    reservation,
    parkingSpotFetching,
  };
};
