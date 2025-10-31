import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ParkingSpot,
  ParkingSpotUpdate,
  ParkingSessionWithDetails,
  ParkingSpotWithLot,
} from "@/types";
import { useCrudMutationConfig, EntityNames } from "@/lib/mutationHelpers";

export const useParkingSpots = (businessId?: string) => {
  return useQuery({
    queryKey: ["parking-spots", businessId],
    queryFn: async (): Promise<ParkingSpotWithLot[]> => {
      let query = supabase
        .from("parking_spots")
        .select("*, parking_lots!inner(*)");

      if (businessId) {
        const { data: lots } = await supabase
          .from("parking_lots")
          .select("id")
          .eq("business_id", businessId);

        if (!lots?.length) return [];

        query = query.in(
          "lot_id",
          lots.map((lot) => lot.id)
        );
      }

      const { data, error } = await query.order("spot_number", {
        ascending: true,
      });

      if (error) throw error;
      return data || [];
    },
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
      // Get current authenticated user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error("Authentication required to check in a vehicle");
      }

      // Get user profile to check role and business association
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, business_id")
        .eq("id", authUser.id)
        .single();

      if (profileError || !profile) {
        throw new Error("User profile not found");
      }

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

      // Check if user has permission (admin/superadmin can check in for any user)
      // Regular users can only check in for themselves or if no userId is provided
      const isAdmin = profile.role === "admin" || profile.role === "superadmin";
      const sessionUserId = userId || authUser.id;

      // If userId is provided but user is not admin, verify it matches their own ID
      if (userId && userId !== authUser.id && !isAdmin) {
        throw new Error("You can only check in vehicles for yourself");
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
            user_id: sessionUserId,
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

        if (sessionError) {
          // Provide more helpful error messages based on RLS policy violations
          if (sessionError.message?.includes("row-level security")) {
            throw new Error(
              `Permission denied: ${
                isAdmin
                  ? "Please contact your administrator"
                  : "You don't have permission to check in vehicles. Contact an administrator."
              }`
            );
          }
          throw sessionError;
        }

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
        ["today-revenue"],
        ["occupancy-stats"],
      ],
      entityName: EntityNames.Vehicle,
      action: "check out",
    }),
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
        durationMs,
        hourlyRate: lot.hourly_rate,
        dailyRate: lot.daily_rate,
      };
    },
  });
};
