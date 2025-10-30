// src/types/index.ts
import type { Database } from "@/integrations/supabase/types";

// Re-export database types for convenience
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// Specific table types
export type Profile = Tables<"profiles">;
export type ParkingLot = Tables<"parking_lots">;
export type ParkingSpot = Tables<"parking_spots">;
export type ParkingSession = Tables<"parking_sessions">;
export type ActivityLog = Tables<"activity_logs">;

// Insert types
export type ProfileInsert = TablesInsert<"profiles">;
export type ParkingLotInsert = TablesInsert<"parking_lots">;
export type ParkingSpotInsert = TablesInsert<"parking_spots">;
export type ParkingSessionInsert = TablesInsert<"parking_sessions">;
export type ActivityLogInsert = TablesInsert<"activity_logs">;

// Update types
export type ProfileUpdate = TablesUpdate<"profiles">;
export type ParkingLotUpdate = TablesUpdate<"parking_lots">;
export type ParkingSpotUpdate = TablesUpdate<"parking_spots">;
export type ParkingSessionUpdate = TablesUpdate<"parking_sessions">;
export type ActivityLogUpdate = TablesUpdate<"activity_logs">;

// Enum types
export type UserRole = Enums<"user_role">;
export type ParkingStatus = Enums<"parking_status">;
export type VehicleType = Enums<"vehicle_type">;

// View types
export type ActiveSession =
  Database["public"]["Views"]["active_sessions"]["Row"];
export type ParkingLotStats =
  Database["public"]["Views"]["parking_lot_stats"]["Row"];

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

export interface ProfileWithBusiness extends Profile {
  businesses?: {
    id: string;
    name: string;
  } | null;
}

// Form types
export interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ProfileFormData {
  full_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}

export interface ParkingLotFormData {
  name: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  total_spots: number;
  hourly_rate: number;
  daily_rate: number;
  monthly_rate: number;
  operating_hours?: Record<string, string>;
  amenities?: string[];
}

export interface ParkingSpotFormData {
  lot_id: string;
  spot_number: string;
  spot_type?: VehicleType;
  status?: ParkingStatus;
  is_reserved?: boolean;
  is_handicap_accessible?: boolean;
  is_electric_charging?: boolean;
  width?: number;
  length?: number;
}

export interface ParkingSessionFormData {
  spot_id: string;
  user_id?: string;
  vehicle_plate: string;
  vehicle_type?: VehicleType;
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  loading: boolean;
  error?: string | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

// Hook return types
export interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseMutationResult<T, V> {
  mutate: (variables: V) => void;
  mutateAsync: (variables: V) => Promise<T>;
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
}
