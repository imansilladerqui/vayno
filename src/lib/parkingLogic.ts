import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Enhanced business logic for parking management
export class ParkingBusinessLogic {
  // Check-in validation and processing
  static async validateCheckIn(spotId: string, vehiclePlate: string) {
    // Check if spot exists and is available
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

    // Check for duplicate active sessions
    const { data: existingSession } = await supabase
      .from("parking_sessions")
      .select("id")
      .eq("spot_id", spotId)
      .is("check_out_time", null)
      .single();

    if (existingSession) {
      throw new Error("Spot already has an active session");
    }

    // Validate license plate format
    if (!vehiclePlate || vehiclePlate.trim().length < 2) {
      throw new Error("Valid license plate is required");
    }

    return { spot, isValid: true };
  }

  // Enhanced check-in with business rules
  static async checkInVehicle(
    spotId: string,
    vehiclePlate: string,
    userId?: string,
    vehicleType: "car" | "motorcycle" | "truck" | "van" | "other" = "car"
  ) {
    // Validate check-in
    const { spot } = await this.validateCheckIn(spotId, vehiclePlate);

    // Get parking lot rates
    const { data: lot, error: lotError } = await supabase
      .from("parking_lots")
      .select("*")
      .eq("id", spot.lot_id)
      .single();

    if (lotError || !lot) {
      throw new Error("Parking lot not found");
    }

    // Start transaction-like operations
    try {
      // 1. Mark spot as occupied
      const { error: spotUpdateError } = await supabase
        .from("parking_spots")
        .update({ status: "occupied" })
        .eq("id", spotId);

      if (spotUpdateError) throw spotUpdateError;

      // 2. Create parking session
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

      // 3. Log activity
      await this.logActivity(
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
  }

  // Enhanced check-out with payment calculation
  static async checkOutVehicle(
    sessionId: string,
    paymentMethod: string = "cash"
  ) {
    // Get session details
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

    // Calculate parking duration and fees
    const checkInTime = new Date(session.check_in_time);
    const checkOutTime = new Date();
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const durationDays = durationMs / (1000 * 60 * 60 * 24);

    // Calculate amount based on parking lot rates
    const lot = session.parking_spots.parking_lots;
    let totalAmount = 0;

    if (durationDays >= 1) {
      // Daily rate applies
      totalAmount = Math.ceil(durationDays) * lot.daily_rate;
    } else {
      // Hourly rate applies (minimum 1 hour)
      totalAmount = Math.max(1, Math.ceil(durationHours)) * lot.hourly_rate;
    }

    try {
      // 1. Update session with checkout details
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

      // 2. Mark spot as available
      const { error: spotUpdateError } = await supabase
        .from("parking_spots")
        .update({ status: "available" })
        .eq("id", session.spot_id);

      if (spotUpdateError) throw spotUpdateError;

      // 3. Create payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        session_id: sessionId,
        amount: totalAmount,
        payment_method: paymentMethod,
        status: "completed",
        processed_at: checkOutTime.toISOString(),
      });

      if (paymentError) throw paymentError;

      // 4. Log activity
      await this.logActivity(
        "UPDATE",
        "parking_sessions",
        sessionId,
        session,
        updatedSession
      );

      return {
        session: updatedSession,
        duration: this.formatDuration(durationMs),
        amount: totalAmount,
        paymentMethod,
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate current parking cost for active session
  static async calculateCurrentCost(sessionId: string) {
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
      duration: this.formatDuration(durationMs),
      hourlyRate: lot.hourly_rate,
      dailyRate: lot.daily_rate,
    };
  }

  // Get parking statistics
  static async getParkingStats(lotId?: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Get today's sessions
    const { data: todaySessions } = await supabase
      .from("parking_sessions")
      .select("total_amount, check_in_time, check_out_time")
      .gte("check_in_time", today.toISOString())
      .lt("check_in_time", tomorrow.toISOString());

    // Get active sessions
    const { data: activeSessions } = await supabase
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
      .is("check_out_time", null);

    // Calculate statistics
    const totalRevenue =
      todaySessions?.reduce(
        (sum, session) => sum + (session.total_amount || 0),
        0
      ) || 0;

    const activeCount = activeSessions?.length || 0;
    const completedCount =
      todaySessions?.filter((s) => s.check_out_time).length || 0;

    return {
      totalRevenue,
      activeSessions: activeCount,
      completedSessions: completedCount,
      averageSessionDuration: this.calculateAverageDuration(todaySessions),
    };
  }

  // Utility methods
  static formatDuration(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  static calculateAverageDuration(
    sessions: Array<{ check_in_time: string; check_out_time: string | null }>
  ): string {
    if (!sessions || sessions.length === 0) return "0m";

    const completedSessions = sessions.filter((s) => s.check_out_time);
    if (completedSessions.length === 0) return "0m";

    const totalDuration = completedSessions.reduce((sum, session) => {
      const checkIn = new Date(session.check_in_time);
      const checkOut = new Date(session.check_out_time);
      return sum + (checkOut.getTime() - checkIn.getTime());
    }, 0);

    const averageMs = totalDuration / completedSessions.length;
    return this.formatDuration(averageMs);
  }

  static async logActivity(
    action: string,
    tableName: string,
    recordId: string,
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null
  ) {
    try {
      await supabase.from("activity_logs").insert({
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        description: `${action} on ${tableName}`,
      });
    } catch {
      // Activity logging failed, operation continues
    }
  }
}
