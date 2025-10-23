export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      parking_lots: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string;
          latitude: number | null;
          longitude: number | null;
          total_spots: number;
          hourly_rate: number;
          daily_rate: number;
          monthly_rate: number;
          is_active: boolean;
          operating_hours: Json | null;
          amenities: Json | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          address: string;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          total_spots?: number;
          hourly_rate?: number;
          daily_rate?: number;
          monthly_rate?: number;
          is_active?: boolean;
          operating_hours?: Json | null;
          amenities?: Json | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          address?: string;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          total_spots?: number;
          hourly_rate?: number;
          daily_rate?: number;
          monthly_rate?: number;
          is_active?: boolean;
          operating_hours?: Json | null;
          amenities?: Json | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      parking_spots: {
        Row: {
          id: string;
          lot_id: string;
          spot_number: string;
          spot_type: "car" | "motorcycle" | "truck" | "van" | "other";
          status: "available" | "occupied" | "reserved" | "maintenance";
          is_reserved: boolean;
          is_handicap_accessible: boolean;
          is_electric_charging: boolean;
          width: number | null;
          length: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lot_id: string;
          spot_number: string;
          spot_type?: "car" | "motorcycle" | "truck" | "van" | "other";
          status?: "available" | "occupied" | "reserved" | "maintenance";
          is_reserved?: boolean;
          is_handicap_accessible?: boolean;
          is_electric_charging?: boolean;
          width?: number | null;
          length?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lot_id?: string;
          spot_number?: string;
          spot_type?: "car" | "motorcycle" | "truck" | "van" | "other";
          status?: "available" | "occupied" | "reserved" | "maintenance";
          is_reserved?: boolean;
          is_handicap_accessible?: boolean;
          is_electric_charging?: boolean;
          width?: number | null;
          length?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "manager" | "operator" | "customer";
          phone: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          address: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "manager" | "operator" | "customer";
          phone?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "manager" | "operator" | "customer";
          phone?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      user_role: "admin" | "manager" | "operator" | "customer";
      parking_status: "available" | "occupied" | "reserved" | "maintenance";
      vehicle_type: "car" | "motorcycle" | "truck" | "van" | "other";
      payment_status: "pending" | "completed" | "failed" | "refunded";
    };
  };
};
