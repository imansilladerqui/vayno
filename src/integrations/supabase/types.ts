export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string;
          created_at: string | null;
          description: string | null;
          id: string;
          ip_address: unknown;
          new_values: Json | null;
          old_values: Json | null;
          record_id: string | null;
          table_name: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          ip_address?: unknown;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          ip_address?: unknown;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          data: Json | null;
          id: string;
          is_read: boolean | null;
          message: string;
          title: string;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          is_read?: boolean | null;
          message: string;
          title: string;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          is_read?: boolean | null;
          message?: string;
          title?: string;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      parking_lots: {
        Row: {
          address: string;
          amenities: Json | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          created_by: string | null;
          daily_rate: number;
          description: string | null;
          hourly_rate: number;
          id: string;
          is_active: boolean | null;
          latitude: number | null;
          longitude: number | null;
          monthly_rate: number;
          name: string;
          operating_hours: Json | null;
          state: string | null;
          total_spots: number;
          updated_at: string | null;
          zip_code: string | null;
        };
        Insert: {
          address: string;
          amenities?: Json | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          daily_rate?: number;
          description?: string | null;
          hourly_rate?: number;
          id?: string;
          is_active?: boolean | null;
          latitude?: number | null;
          longitude?: number | null;
          monthly_rate?: number;
          name: string;
          operating_hours?: Json | null;
          state?: string | null;
          total_spots?: number;
          updated_at?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string;
          amenities?: Json | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          daily_rate?: number;
          description?: string | null;
          hourly_rate?: number;
          id?: string;
          is_active?: boolean | null;
          latitude?: number | null;
          longitude?: number | null;
          monthly_rate?: number;
          name?: string;
          operating_hours?: Json | null;
          state?: string | null;
          total_spots?: number;
          updated_at?: string | null;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "parking_lots_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      parking_sessions: {
        Row: {
          check_in_time: string | null;
          check_out_time: string | null;
          created_at: string | null;
          daily_rate: number | null;
          hourly_rate: number | null;
          id: string;
          monthly_rate: number | null;
          notes: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"] | null;
          spot_id: string | null;
          total_amount: number | null;
          updated_at: string | null;
          user_id: string | null;
          vehicle_plate: string | null;
          vehicle_type: Database["public"]["Enums"]["vehicle_type"] | null;
        };
        Insert: {
          check_in_time?: string | null;
          check_out_time?: string | null;
          created_at?: string | null;
          daily_rate?: number | null;
          hourly_rate?: number | null;
          id?: string;
          monthly_rate?: number | null;
          notes?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          spot_id?: string | null;
          total_amount?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          vehicle_plate?: string | null;
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"] | null;
        };
        Update: {
          check_in_time?: string | null;
          check_out_time?: string | null;
          created_at?: string | null;
          daily_rate?: number | null;
          hourly_rate?: number | null;
          id?: string;
          monthly_rate?: number | null;
          notes?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          spot_id?: string | null;
          total_amount?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          vehicle_plate?: string | null;
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "parking_sessions_spot_id_fkey";
            columns: ["spot_id"];
            isOneToOne: false;
            referencedRelation: "parking_spots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parking_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      parking_spots: {
        Row: {
          created_at: string | null;
          id: string;
          is_electric_charging: boolean | null;
          is_handicap_accessible: boolean | null;
          is_reserved: boolean | null;
          length: number | null;
          lot_id: string | null;
          spot_number: string;
          spot_type: Database["public"]["Enums"]["vehicle_type"] | null;
          status: Database["public"]["Enums"]["parking_status"] | null;
          updated_at: string | null;
          width: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_electric_charging?: boolean | null;
          is_handicap_accessible?: boolean | null;
          is_reserved?: boolean | null;
          length?: number | null;
          lot_id?: string | null;
          spot_number: string;
          spot_type?: Database["public"]["Enums"]["vehicle_type"] | null;
          status?: Database["public"]["Enums"]["parking_status"] | null;
          updated_at?: string | null;
          width?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_electric_charging?: boolean | null;
          is_handicap_accessible?: boolean | null;
          is_reserved?: boolean | null;
          length?: number | null;
          lot_id?: string | null;
          spot_number?: string;
          spot_type?: Database["public"]["Enums"]["vehicle_type"] | null;
          status?: Database["public"]["Enums"]["parking_status"] | null;
          updated_at?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "parking_spots_lot_id_fkey";
            columns: ["lot_id"];
            isOneToOne: false;
            referencedRelation: "parking_lot_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parking_spots_lot_id_fkey";
            columns: ["lot_id"];
            isOneToOne: false;
            referencedRelation: "parking_lots";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string | null;
          id: string;
          payment_method: string;
          payment_provider: string | null;
          processed_at: string | null;
          refund_amount: number | null;
          refunded_at: string | null;
          session_id: string | null;
          status: Database["public"]["Enums"]["payment_status"] | null;
          transaction_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: string;
          payment_method: string;
          payment_provider?: string | null;
          processed_at?: string | null;
          refund_amount?: number | null;
          refunded_at?: string | null;
          session_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"] | null;
          transaction_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: string;
          payment_method?: string;
          payment_provider?: string | null;
          processed_at?: string | null;
          refund_amount?: number | null;
          refunded_at?: string | null;
          session_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"] | null;
          transaction_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "active_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "parking_sessions";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          created_at: string | null;
          date_of_birth: string | null;
          email: string;
          full_name: string | null;
          id: string;
          is_active: boolean | null;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          is_active?: boolean | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          amount: number | null;
          created_at: string | null;
          end_time: string;
          id: string;
          payment_id: string | null;
          spot_id: string | null;
          start_time: string;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          end_time: string;
          id?: string;
          payment_id?: string | null;
          spot_id?: string | null;
          start_time: string;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          end_time?: string;
          id?: string;
          payment_id?: string | null;
          spot_id?: string | null;
          start_time?: string;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reservations_payment_id_fkey";
            columns: ["payment_id"];
            isOneToOne: false;
            referencedRelation: "payments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reservations_spot_id_fkey";
            columns: ["spot_id"];
            isOneToOne: false;
            referencedRelation: "parking_spots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reservations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      active_sessions: {
        Row: {
          check_in_time: string | null;
          check_out_time: string | null;
          created_at: string | null;
          daily_rate: number | null;
          hourly_rate: number | null;
          id: string | null;
          lot_address: string | null;
          lot_name: string | null;
          monthly_rate: number | null;
          notes: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"] | null;
          spot_id: string | null;
          total_amount: number | null;
          updated_at: string | null;
          user_email: string | null;
          user_id: string | null;
          user_name: string | null;
          vehicle_plate: string | null;
          vehicle_type: Database["public"]["Enums"]["vehicle_type"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "parking_sessions_spot_id_fkey";
            columns: ["spot_id"];
            isOneToOne: false;
            referencedRelation: "parking_spots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parking_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      parking_lot_stats: {
        Row: {
          available_spots: number | null;
          id: string | null;
          maintenance_spots: number | null;
          name: string | null;
          occupancy_percentage: number | null;
          occupied_spots: number | null;
          reserved_spots: number | null;
          total_spots: number | null;
          total_spots_created: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      parking_status: "available" | "occupied" | "reserved" | "maintenance";
      payment_status: "pending" | "completed" | "failed" | "refunded";
      user_role: "customer" | "admin" | "superadmin";
      vehicle_type: "car" | "motorcycle" | "truck" | "van" | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      parking_status: ["available", "occupied", "reserved", "maintenance"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["customer", "admin", "superadmin"],
      vehicle_type: ["car", "motorcycle", "truck", "van", "other"],
    },
  },
} as const;
