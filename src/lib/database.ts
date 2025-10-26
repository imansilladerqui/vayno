import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ParkingBusinessLogic } from "./parkingLogic";

// Type definitions for our database tables
export type ParkingLot = Database["public"]["Tables"]["parking_lots"]["Row"];
export type ParkingSpot = Database["public"]["Tables"]["parking_spots"]["Row"];
export type ParkingSession =
  Database["public"]["Tables"]["parking_sessions"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

// Insert types
export type ParkingLotInsert =
  Database["public"]["Tables"]["parking_lots"]["Insert"];
export type ParkingSpotInsert =
  Database["public"]["Tables"]["parking_spots"]["Insert"];
export type ParkingSessionInsert =
  Database["public"]["Tables"]["parking_sessions"]["Insert"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

// Update types
export type ParkingLotUpdate =
  Database["public"]["Tables"]["parking_lots"]["Update"];
export type ParkingSpotUpdate =
  Database["public"]["Tables"]["parking_spots"]["Update"];
export type ParkingSessionUpdate =
  Database["public"]["Tables"]["parking_sessions"]["Update"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Extended types with relations
export type ParkingSessionWithDetails = ParkingSession & {
  parking_spots: ParkingSpot & {
    parking_lots: ParkingLot;
  };
  profiles?: Profile | null;
};

export type ParkingSpotWithLot = ParkingSpot & {
  parking_lots: ParkingLot;
};

export type ActivityLogWithProfile = ActivityLog & {
  profiles?: Profile | null;
};

// Database service class
export class DatabaseService {
  // Parking Lots
  static async getParkingLots(): Promise<ParkingLot[]> {
    const { data, error } = await supabase
      .from("parking_lots")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getParkingLot(id: string): Promise<ParkingLot | null> {
    const { data, error } = await supabase
      .from("parking_lots")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createParkingLot(lot: ParkingLotInsert): Promise<ParkingLot> {
    const { data, error } = await supabase
      .from("parking_lots")
      .insert(lot)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateParkingLot(
    id: string,
    updates: ParkingLotUpdate
  ): Promise<ParkingLot> {
    const { data, error } = await supabase
      .from("parking_lots")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Parking Spots
  static async getParkingSpots(lotId?: string): Promise<ParkingSpotWithLot[]> {
    let query = supabase.from("parking_spots").select(`
        *,
        parking_lots!inner(*)
      `);

    if (lotId) {
      query = query.eq("lot_id", lotId);
    }

    const { data, error } = await query.order("spot_number", {
      ascending: true,
    });

    if (error) throw error;
    return data || [];
  }

  static async getParkingSpot(id: string): Promise<ParkingSpotWithLot | null> {
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
  }

  static async updateParkingSpot(
    id: string,
    updates: Partial<ParkingSpotUpdate>
  ): Promise<ParkingSpot> {
    const { data, error } = await supabase
      .from("parking_spots")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createParkingSpots(
    spots: ParkingSpotInsert[]
  ): Promise<ParkingSpot[]> {
    const { data, error } = await supabase
      .from("parking_spots")
      .insert(spots)
      .select();

    if (error) throw error;
    return data || [];
  }

  // Parking Sessions
  static async getParkingSessions(filters?: {
    userId?: string;
    spotId?: string;
    activeOnly?: boolean;
  }): Promise<ParkingSessionWithDetails[]> {
    let query = supabase.from("parking_sessions").select(`
        *,
        parking_spots!inner(
          *,
          parking_lots!inner(*)
        ),
        profiles(*)
      `);

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
  }

  static async getActiveSessions(): Promise<ParkingSessionWithDetails[]> {
    return this.getParkingSessions({ activeOnly: true });
  }

  static async createParkingSession(
    session: ParkingSessionInsert
  ): Promise<ParkingSessionWithDetails> {
    const { data, error } = await supabase
      .from("parking_sessions")
      .insert(session)
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

    if (error) throw error;
    return data;
  }

  static async updateParkingSession(
    id: string,
    updates: ParkingSessionUpdate
  ): Promise<ParkingSessionWithDetails> {
    const { data, error } = await supabase
      .from("parking_sessions")
      .update(updates)
      .eq("id", id)
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

    if (error) throw error;
    return data;
  }

  static async checkInVehicle(
    spotId: string,
    vehiclePlate: string,
    userId?: string,
    vehicleType: "car" | "motorcycle" | "truck" | "van" | "other" = "car"
  ): Promise<ParkingSessionWithDetails> {
    return await ParkingBusinessLogic.checkInVehicle(
      spotId,
      vehiclePlate,
      userId,
      vehicleType
    );
  }

  static async checkOutVehicle(
    sessionId: string,
    paymentMethod: string = "cash"
  ): Promise<ParkingSessionWithDetails> {
    const result = await ParkingBusinessLogic.checkOutVehicle(
      sessionId,
      paymentMethod
    );
    return result.session;
  }

  static async getParkingSession(
    id: string
  ): Promise<ParkingSessionWithDetails | null> {
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
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Activity Logs
  static async getActivityLogs(limit = 50): Promise<ActivityLogWithProfile[]> {
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
  }

  // Notifications
  static async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;
  }

  // Statistics and Analytics
  static async getParkingLotStats(lotId?: string) {
    let query = supabase.from("parking_lot_stats").select("*");

    if (lotId) {
      query = query.eq("id", lotId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getTodayRevenue(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from("parking_sessions")
      .select("total_amount")
      .gte("check_out_time", today.toISOString())
      .lt("check_out_time", tomorrow.toISOString())
      .not("total_amount", "is", null);

    if (error) throw error;

    return (
      data?.reduce((sum, session) => sum + (session.total_amount || 0), 0) || 0
    );
  }

  static async getOccupancyStats() {
    const { data, error } = await supabase
      .from("parking_spots")
      .select("status");

    if (error) throw error;

    const stats =
      data?.reduce((acc, spot) => {
        if (spot.status) {
          acc[spot.status] = (acc[spot.status] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

    return {
      total: Object.values(stats).reduce((sum, count) => sum + count, 0),
      available: stats.available || 0,
      occupied: stats.occupied || 0,
      reserved: stats.reserved || 0,
      maintenance: stats.maintenance || 0,
    };
  }

  // Business Logic Methods
  static async calculateCurrentCost(sessionId: string) {
    return await ParkingBusinessLogic.calculateCurrentCost(sessionId);
  }

  static async getParkingStats(lotId?: string) {
    return await ParkingBusinessLogic.getParkingStats(lotId);
  }
}
