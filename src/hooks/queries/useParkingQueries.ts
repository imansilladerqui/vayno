import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ParkingSpot,
  ParkingSessionWithDetails,
  ParkingSpotWithBusiness,
} from "@/types";
import { useCrudMutationConfig, EntityNames } from "@/lib/mutationHelpers";
import {
  parseCustomerInfoFromNotes,
  normalizeVehiclePlate,
  createCustomerInfoJson,
  PARKING_STATUS,
} from "@/lib/utils";
import {
  PARKING_SESSION_SELECT,
  PARKING_SESSION_SELECT_WITHOUT_PROFILES,
} from "@/lib/supabaseQueries";

export const useParkingSpotsQuery = (businessId?: string) => {
  return useQuery({
    queryKey: ["parking-spots", businessId],
    queryFn: async (): Promise<ParkingSpotWithBusiness[]> => {
      let query = supabase
        .from("parking_spots")
        .select("*, businesses!inner(*)");

      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      const { data, error } = await query.order("spot_number", {
        ascending: true,
      });

      if (error) throw error;
      return (data ?? []) as unknown as ParkingSpotWithBusiness[];
    },
  });
};

export const useCheckInVehicleQuery = () => {
  return useMutation({
    mutationFn: async ({
      spotId,
      vehiclePlate,
      userId,
      vehicleType = "car",
      customerName,
      customerPhone,
      customerEmail,
    }: {
      spotId: string;
      vehiclePlate: string;
      userId?: string;
      vehicleType?: "car" | "motorcycle" | "truck" | "van" | "other";
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
    }): Promise<ParkingSessionWithDetails> => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error("Authentication required to check in a vehicle");
      }

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

      const typedSpot = spot as ParkingSpot & {
        business_id?: string | null;
        hourly_rate?: number | null;
        daily_rate?: number | null;
        monthly_rate?: number | null;
      };

      if (
        typedSpot.status !== PARKING_STATUS.AVAILABLE &&
        typedSpot.status !== PARKING_STATUS.RESERVED
      ) {
        throw new Error(
          `Spot ${typedSpot.spot_number} is not available (Status: ${typedSpot.status})`
        );
      }

      if (typedSpot.status === PARKING_STATUS.RESERVED) {
        const { data: activeReservation } = await supabase
          .from("reservations")
          .select("id")
          .eq("spot_id", spotId)
          .neq("status", "cancelled")
          .gte("end_time", new Date().toISOString())
          .maybeSingle();

        if (activeReservation) {
          await supabase
            .from("reservations")
            .update({ status: "cancelled" })
            .eq("id", activeReservation.id);
        }
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

      if (!typedSpot.business_id) {
        throw new Error("Parking spot has no associated business");
      }

      const { data: business, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", typedSpot.business_id)
        .single();

      if (businessError || !business) {
        throw new Error("Business not found");
      }

      const hourlyRate = typedSpot.hourly_rate || 0;
      const dailyRate = typedSpot.daily_rate || 0;
      const monthlyRate = typedSpot.monthly_rate || 0;

      const isAdmin = profile.role === "admin" || profile.role === "superadmin";
      const sessionUserId = userId || authUser.id;

      if (userId && userId !== authUser.id && !isAdmin) {
        throw new Error("You can only check in vehicles for yourself");
      }

      try {
        const { error: spotUpdateError } = await supabase
          .from("parking_spots")
          .update({ status: PARKING_STATUS.OCCUPIED })
          .eq("id", spotId);

        if (spotUpdateError) throw spotUpdateError;

        const customerInfo = createCustomerInfoJson({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        });

        const { data: session, error: sessionError } = await supabase
          .from("parking_sessions")
          .insert({
            spot_id: spotId,
            user_id: sessionUserId,
            vehicle_plate: normalizeVehiclePlate(vehiclePlate),
            vehicle_type: vehicleType,
            check_in_time: new Date().toISOString(),
            hourly_rate: hourlyRate,
            daily_rate: dailyRate,
            monthly_rate: monthlyRate,
            payment_status: "pending",
            notes: customerInfo,
          })
          .select(PARKING_SESSION_SELECT)
          .single();

        if (sessionError) {
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

        const sessionWithCustomer =
          session as unknown as ParkingSessionWithDetails;
        parseCustomerInfoFromNotes(sessionWithCustomer);

        return sessionWithCustomer;
      } catch (error) {
        await supabase
          .from("parking_spots")
          .update({ status: PARKING_STATUS.AVAILABLE })
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
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
      }
    >({
      invalidateKeys: [
        ["parking-sessions"],
        ["active-sessions"],
        ["parking-spots"],
        ["occupancy-stats"],
        ["reservations"],
      ],
      entityName: EntityNames.Vehicle,
      action: "check in",
    }),
  });
};

export const useCheckOutVehicleQuery = () => {
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
        .select(PARKING_SESSION_SELECT)
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

      const spot = session.parking_spots as ParkingSpot & {
        hourly_rate?: number | null;
        daily_rate?: number | null;
        monthly_rate?: number | null;
      };
      const dailyRate = spot.daily_rate || 0;
      const hourlyRate = spot.hourly_rate || 0;
      let totalAmount = 0;

      if (durationDays >= 1) {
        totalAmount = Math.ceil(durationDays) * dailyRate;
      } else {
        totalAmount = Math.max(1, Math.ceil(durationHours)) * hourlyRate;
      }

      const { data: updatedSession, error: updateError } = await supabase
        .from("parking_sessions")
        .update({
          check_out_time: checkOutTime.toISOString(),
          total_amount: totalAmount,
          payment_status: "completed",
        })
        .eq("id", sessionId)
        .select(PARKING_SESSION_SELECT)
        .single();

      if (updateError) throw updateError;
      if (!updatedSession) throw new Error("Failed to update session");

      const typedSession =
        updatedSession as unknown as ParkingSessionWithDetails;

      if (!typedSession.spot_id) {
        throw new Error("Session missing spot ID");
      }

      const { error: spotUpdateError } = await supabase
        .from("parking_spots")
        .update({ status: PARKING_STATUS.AVAILABLE })
        .eq("id", typedSession.spot_id);

      if (spotUpdateError) throw spotUpdateError;

      const { error: paymentError } = await supabase.from("payments").insert({
        session_id: sessionId,
        amount: totalAmount,
        payment_method: paymentMethod,
        status: "completed",
        processed_at: checkOutTime.toISOString(),
      });

      if (paymentError) throw paymentError;

      parseCustomerInfoFromNotes(typedSession);

      return typedSession;
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

export const useParkingSessionQuery = (spotId?: string) => {
  return useQuery({
    queryKey: ["parking-sessions", "active", spotId],
    queryFn: async (): Promise<ParkingSessionWithDetails | null> => {
      if (!spotId) return null;

      const { data, error } = await supabase
        .from("parking_sessions")
        .select(PARKING_SESSION_SELECT)
        .eq("spot_id", spotId)
        .is("check_out_time", null)
        .order("check_in_time", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const session = data as unknown as ParkingSessionWithDetails;
      parseCustomerInfoFromNotes(session);
      return session;
    },
    enabled: !!spotId,
  });
};

export const useCalculateCurrentCostQuery = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data: session, error } = await supabase
        .from("parking_sessions")
        .select(PARKING_SESSION_SELECT_WITHOUT_PROFILES)
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

      const spot = session.parking_spots as ParkingSpot & {
        hourly_rate?: number | null;
        daily_rate?: number | null;
        monthly_rate?: number | null;
      };
      const dailyRate = spot.daily_rate || 0;
      const hourlyRate = spot.hourly_rate || 0;
      let currentCost = 0;

      if (durationDays >= 1) {
        currentCost = Math.ceil(durationDays) * dailyRate;
      } else {
        currentCost = Math.max(1, Math.ceil(durationHours)) * hourlyRate;
      }

      return {
        currentCost,
        durationMs,
        hourlyRate,
        dailyRate,
      };
    },
  });
};
