import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ParkingLot,
  ParkingLotInsert,
  ParkingLotUpdate,
  ParkingSpot,
  ParkingSpotInsert,
  ParkingSpotUpdate,
  ParkingSessionWithDetails,
  ParkingSpotWithLot,
  ActivityLogWithProfile,
} from "@/types";
import { useCrudMutationConfig, EntityNames } from "@/lib/mutationHelpers";

// Utility functions for parking operations
const formatDuration = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const logActivity = async (
  action: string,
  tableName: string,
  recordId: string,
  oldValues: Record<string, unknown> | null,
  newValues: Record<string, unknown> | null
) => {
  try {
    await supabase.from("activity_logs").insert({
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: (oldValues as unknown) || null,
      new_values: (newValues as unknown) || null,
      description: `${action} on ${tableName}`,
    } as never);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

export const parkingQueryKeys = {
  parkingLots: ["parking-lots"] as const,
  parkingLot: (id: string) => ["parking-lot", id] as const,
  parkingSpots: (lotId?: string) => ["parking-spots", lotId] as const,
  parkingSpot: (id: string) => ["parking-spot", id] as const,
  parkingSessions: (filters?: {
    userId?: string;
    spotId?: string;
    activeOnly?: boolean;
  }) => ["parking-sessions", filters] as const,
  activeSessions: ["active-sessions"] as const,
  activityLogs: ["activity-logs"] as const,
};

export const useParkingLots = () => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingLots,
    queryFn: async (): Promise<ParkingLot[]> => {
      const { data, error } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useParkingLot = (id: string) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingLot(id),
    queryFn: async (): Promise<ParkingLot | null> => {
      const { data, error } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateParkingLot = () => {
  return useMutation({
    mutationFn: async (lot: ParkingLotInsert): Promise<ParkingLot> => {
      const { data, error } = await supabase
        .from("parking_lots")
        .insert(lot)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    ...useCrudMutationConfig<ParkingLot, Error, ParkingLotInsert>({
      invalidateKeys: [["parking-lots"], ["parking-lot-stats"]],
      entityName: EntityNames.ParkingLot,
      action: "create",
    }),
  });
};

export const useUpdateParkingLot = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ParkingLotUpdate;
    }): Promise<ParkingLot> => {
      const { data, error } = await supabase
        .from("parking_lots")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    ...useCrudMutationConfig<
      ParkingLot,
      Error,
      { id: string; updates: ParkingLotUpdate }
    >({
      invalidateKeys: [["parking-lots"], ["parking-lot-stats"]],
      entityName: EntityNames.ParkingLot,
      action: "update",
    }),
  });
};

export const useParkingSpots = (lotId?: string) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingSpots(lotId),
    queryFn: async (): Promise<ParkingSpotWithLot[]> => {
      let query = supabase.from("parking_spots").select(
        `
          *,
          parking_lots!inner(*)
        `
      );

      if (lotId) {
        query = query.eq("lot_id", lotId);
      }

      const { data, error } = await query.order("spot_number", {
        ascending: true,
      });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useParkingSpot = (id: string) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingSpot(id),
    queryFn: async (): Promise<ParkingSpotWithLot | null> => {
      const { data, error } = await supabase
        .from("parking_spots")
        .select(
          `
          *,
          parking_lots!inner(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateParkingSpot = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ParkingSpotUpdate>;
    }): Promise<ParkingSpot> => {
      const { data, error } = await supabase
        .from("parking_spots")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    ...useCrudMutationConfig<
      ParkingSpot,
      Error,
      { id: string; updates: Partial<ParkingSpotUpdate> }
    >({
      invalidateKeys: [["parking-spots"], ["occupancy-stats"]],
      entityName: EntityNames.ParkingSpot,
      action: "update",
    }),
  });
};

export const useCreateParkingSpots = () => {
  return useMutation({
    mutationFn: async (spots: ParkingSpotInsert[]): Promise<ParkingSpot[]> => {
      const { data, error } = await supabase
        .from("parking_spots")
        .insert(spots)
        .select();

      if (error) throw error;
      return data || [];
    },
    ...useCrudMutationConfig<ParkingSpot[], Error, ParkingSpotInsert[]>({
      invalidateKeys: [["parking-spots"], ["occupancy-stats"]],
      entityName: EntityNames.ParkingSpots,
      action: "create",
    }),
  });
};

export const useParkingSessions = (filters?: {
  userId?: string;
  spotId?: string;
  activeOnly?: boolean;
}) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingSessions(filters),
    queryFn: async (): Promise<ParkingSessionWithDetails[]> => {
      let query = supabase.from("parking_sessions").select(
        `
          *,
          parking_spots!inner(
            *,
            parking_lots!inner(*)
          ),
          profiles(*)
        `
      );

      if (filters?.userId) {
        query = query.eq("user_id", filters.userId);
      }

      if (filters?.spotId) {
        query = query.eq("spot_id", filters.spotId);
      }

      if (filters?.activeOnly) {
        query = query.is("check_out_time", null);
      }

      const { data, error } = await query.order("check_in_time", {
        ascending: false,
      });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: parkingQueryKeys.activeSessions,
    queryFn: async (): Promise<ParkingSessionWithDetails[]> => {
      const { data, error } = await supabase
        .from("parking_sessions")
        .select(
          `
          *,
          parking_spots!inner(
            *,
            parking_lots!inner(*)
          ),
          profiles(*)
        `
        )
        .is("check_out_time", null)
        .order("check_in_time", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCheckInVehicle = () => {
  return useMutation({
    mutationFn: async ({
      spotId,
      vehiclePlate,
      userId,
      vehicleType = "car",
    }: {
      spotId: string;
      vehiclePlate: string;
      userId?: string;
      vehicleType?: "car" | "motorcycle" | "truck" | "van" | "other";
    }): Promise<ParkingSessionWithDetails> => {
      // Validate spot availability
      const { data: spot, error: spotError } = await supabase
        .from("parking_spots")
        .select("*")
        .eq("id", spotId)
        .single();

      if (spotError || !spot) {
        throw new Error("Parking spot not found");
      }

      if (spot.status !== "available") {
        throw new Error(
          `Spot ${spot.spot_number} is not available (Status: ${spot.status})`
        );
      }

      const { data: existingSession } = await supabase
        .from("parking_sessions")
        .select("id")
        .eq("spot_id", spotId)
        .is("check_out_time", null)
        .single();

      if (existingSession) {
        throw new Error("Spot already has an active session");
      }

      if (!vehiclePlate || vehiclePlate.trim().length < 2) {
        throw new Error("Valid license plate is required");
      }

      if (!spot.lot_id) {
        throw new Error("Parking spot has no associated lot");
      }

      const { data: lot, error: lotError } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("id", spot.lot_id)
        .single();

      if (lotError || !lot) {
        throw new Error("Parking lot not found");
      }

      try {
        const { error: spotUpdateError } = await supabase
          .from("parking_spots")
          .update({ status: "occupied" })
          .eq("id", spotId);

        if (spotUpdateError) throw spotUpdateError;

        const { data: session, error: sessionError } = await supabase
          .from("parking_sessions")
          .insert({
            spot_id: spotId,
            user_id: userId || null,
            vehicle_plate: vehiclePlate.trim().toUpperCase(),
            vehicle_type: vehicleType,
            check_in_time: new Date().toISOString(),
            hourly_rate: lot.hourly_rate,
            daily_rate: lot.daily_rate,
            monthly_rate: lot.monthly_rate,
            payment_status: "pending",
          })
          .select(
            `
            *,
            parking_spots!inner(
              *,
              parking_lots!inner(*)
            ),
            profiles(*)
          `
          )
          .single();

        if (sessionError) throw sessionError;

        await logActivity(
          "INSERT",
          "parking_sessions",
          session.id,
          null,
          session
        );

        return session;
      } catch (error) {
        // Rollback: Mark spot as available if session creation failed
        await supabase
          .from("parking_spots")
          .update({ status: "available" })
          .eq("id", spotId);

        throw error;
      }
    },
    ...useCrudMutationConfig<
      ParkingSessionWithDetails,
      Error,
      {
        spotId: string;
        vehiclePlate: string;
        userId?: string;
        vehicleType?: "car" | "motorcycle" | "truck" | "van" | "other";
      }
    >({
      invalidateKeys: [
        ["parking-sessions"],
        ["active-sessions"],
        ["parking-spots"],
        ["activity-logs"],
        ["occupancy-stats"],
      ],
      entityName: EntityNames.Vehicle,
      action: "check in",
    }),
  });
};

export const useCheckOutVehicle = () => {
  return useMutation({
    mutationFn: async ({
      sessionId,
      paymentMethod = "cash",
    }: {
      sessionId: string;
      paymentMethod?: string;
    }): Promise<ParkingSessionWithDetails> => {
      const { data: session, error: sessionError } = await supabase
        .from("parking_sessions")
        .select(
          `
          *,
          parking_spots!inner(
            *,
            parking_lots!inner(*)
          ),
          profiles(*)
        `
        )
        .eq("id", sessionId)
        .single();

      if (sessionError || !session) {
        throw new Error("Session not found");
      }

      if (session.check_out_time) {
        throw new Error("Session already completed");
      }

      if (!session.check_in_time) {
        throw new Error("Session missing check-in time");
      }

      const checkInTime = new Date(session.check_in_time);
      const checkOutTime = new Date();
      const durationMs = checkOutTime.getTime() - checkInTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      const durationDays = durationMs / (1000 * 60 * 60 * 24);

      const lot = session.parking_spots.parking_lots;
      let totalAmount = 0;

      if (durationDays >= 1) {
        totalAmount = Math.ceil(durationDays) * lot.daily_rate;
      } else {
        totalAmount = Math.max(1, Math.ceil(durationHours)) * lot.hourly_rate;
      }

      const { data: updatedSession, error: updateError } = await supabase
        .from("parking_sessions")
        .update({
          check_out_time: checkOutTime.toISOString(),
          total_amount: totalAmount,
          payment_status: "completed",
        })
        .eq("id", sessionId)
        .select(
          `
            *,
            parking_spots!inner(
              *,
              parking_lots!inner(*)
            ),
            profiles(*)
          `
        )
        .single();

      if (updateError) throw updateError;

      if (!session.spot_id) {
        throw new Error("Session missing spot ID");
      }

      const { error: spotUpdateError } = await supabase
        .from("parking_spots")
        .update({ status: "available" })
        .eq("id", session.spot_id);

      if (spotUpdateError) throw spotUpdateError;

      const { error: paymentError } = await supabase.from("payments").insert({
        session_id: sessionId,
        amount: totalAmount,
        payment_method: paymentMethod,
        status: "completed",
        processed_at: checkOutTime.toISOString(),
      });

      if (paymentError) throw paymentError;

      await logActivity(
        "UPDATE",
        "parking_sessions",
        sessionId,
        session,
        updatedSession
      );

      return updatedSession;
    },
    ...useCrudMutationConfig<
      ParkingSessionWithDetails,
      Error,
      { sessionId: string; paymentMethod?: string }
    >({
      invalidateKeys: [
        ["parking-sessions"],
        ["active-sessions"],
        ["parking-spots"],
        ["activity-logs"],
        ["today-revenue"],
        ["occupancy-stats"],
      ],
      entityName: EntityNames.Vehicle,
      action: "check out",
    }),
  });
};

export const useActivityLogs = (limit = 50) => {
  return useQuery({
    queryKey: parkingQueryKeys.activityLogs,
    queryFn: async (): Promise<ActivityLogWithProfile[]> => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(
          `
          *,
          profiles(*)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCalculateCurrentCost = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data: session, error } = await supabase
        .from("parking_sessions")
        .select(
          `
          *,
          parking_spots!inner(
            *,
            parking_lots!inner(*)
          )
        `
        )
        .eq("id", sessionId)
        .single();

      if (error || !session) {
        throw new Error("Session not found");
      }

      if (!session.check_in_time) {
        throw new Error("Session missing check-in time");
      }

      const checkInTime = new Date(session.check_in_time);
      const now = new Date();
      const durationMs = now.getTime() - checkInTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      const durationDays = durationMs / (1000 * 60 * 60 * 24);

      const lot = session.parking_spots.parking_lots;
      let currentCost = 0;

      if (durationDays >= 1) {
        currentCost = Math.ceil(durationDays) * lot.daily_rate;
      } else {
        currentCost = Math.max(1, Math.ceil(durationHours)) * lot.hourly_rate;
      }

      return {
        currentCost,
        duration: formatDuration(durationMs),
        hourlyRate: lot.hourly_rate,
        dailyRate: lot.daily_rate,
      };
    },
  });
};
