import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Reservation, ReservationInsert } from "@/types";
import { useCrudMutationConfig, EntityNames } from "@/lib/mutationHelpers";
import { RESERVATION_SELECT } from "@/lib/supabaseQueries";
import { normalizeCustomerInfo, PARKING_STATUS } from "@/lib/utils";

export const reservationQueryKeys = {
  all: ["reservations"] as const,
  bySpot: (spotId: string) =>
    [...reservationQueryKeys.all, "by-spot", spotId] as const,
};

export type ReservationWithDetails = Reservation & {
  parking_spots?: {
    id: string;
    spot_number: string;
    businesses?: {
      id: string;
      name: string;
    } | null;
  } | null;
  profiles?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
  vehicle_plate?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
};

export const useSpotReservationQuery = (spotId?: string) => {
  return useQuery({
    queryKey: reservationQueryKeys.bySpot(spotId || ""),
    queryFn: async (): Promise<ReservationWithDetails | null> => {
      if (!spotId) return null;

      const { data, error } = await supabase
        .from("reservations")
        .select(RESERVATION_SELECT)
        .eq("spot_id", spotId)
        .gte("end_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return (data as unknown as ReservationWithDetails) || null;
    },
    enabled: !!spotId,
  });
};

export const useCreateReservationQuery = () => {
  return useMutation({
    mutationFn: async (
      data: ReservationInsert & {
        customer_name?: string;
        customer_phone?: string;
        customer_email?: string;
        vehicle_plate?: string;
      }
    ): Promise<ReservationWithDetails> => {
      const {
        customer_name,
        customer_phone,
        customer_email,
        vehicle_plate,
        ...reservationData
      } = data;

      const startTime = new Date(reservationData.start_time);

      if (startTime < new Date()) {
        throw new Error("Cannot create reservation in the past");
      }

      const endTime = reservationData.end_time
        ? new Date(reservationData.end_time)
        : new Date(startTime.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);

      const { data: existingReservation } = await supabase
        .from("reservations")
        .select("id")
        .eq("spot_id", reservationData.spot_id || "")
        .neq("status", "cancelled")
        .lte("start_time", endTime.toISOString())
        .gte("end_time", startTime.toISOString())
        .maybeSingle();

      if (existingReservation) {
        throw new Error("Spot is already reserved for this time period");
      }

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      const reservationPayload: ReservationInsert = {
        ...reservationData,
        end_time: endTime.toISOString(),
        user_id: authUser?.id || reservationData.user_id || null,
        status: reservationData.status || "pending",
      };

      const { data: reservation, error } = await supabase
        .from("reservations")
        .insert(reservationPayload)
        .select(RESERVATION_SELECT)
        .single();

      if (error) throw error;

      await supabase
        .from("parking_spots")
        .update({ status: PARKING_STATUS.RESERVED })
        .eq("id", reservationData.spot_id!);

      const normalizedCustomer = normalizeCustomerInfo({
        name: customer_name,
        email: customer_email,
        phone: customer_phone,
      });

      const reservationWithDetails = {
        ...reservation,
        vehicle_plate: vehicle_plate || null,
        ...normalizedCustomer,
      } as unknown as ReservationWithDetails;

      return reservationWithDetails;
    },
    ...useCrudMutationConfig<
      ReservationWithDetails,
      Error,
      ReservationInsert & {
        customer_name?: string;
        customer_phone?: string;
        customer_email?: string;
        vehicle_plate?: string;
      }
    >({
      invalidateKeys: [
        ["reservations"],
        ["parking-spots"],
        ["occupancy-stats"],
      ],
      entityName: EntityNames.ParkingSpots,
      action: "create",
    }),
  });
};

export const useCancelReservationQuery = () => {
  return useMutation({
    mutationFn: async (reservationId: string): Promise<void> => {
      const { data: reservation, error: fetchError } = await supabase
        .from("reservations")
        .select("spot_id")
        .eq("id", reservationId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("id", reservationId);

      if (updateError) throw updateError;

      const { data: otherReservations } = await supabase
        .from("reservations")
        .select("id")
        .eq("spot_id", reservation.spot_id || "")
        .neq("status", "cancelled")
        .gte("end_time", new Date().toISOString());

      if (!otherReservations || otherReservations.length === 0) {
        await supabase
          .from("parking_spots")
          .update({ status: PARKING_STATUS.AVAILABLE })
          .eq("id", reservation.spot_id || "");
      }
    },
    ...useCrudMutationConfig<void, Error, string>({
      invalidateKeys: [
        ["reservations"],
        ["parking-spots"],
        ["occupancy-stats"],
      ],
      entityName: EntityNames.ParkingSpots,
      action: "delete",
    }),
  });
};
