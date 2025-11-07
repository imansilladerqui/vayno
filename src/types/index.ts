import type { Database } from "@/integrations/supabase/types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type Profile = Tables<"profiles">;
export type Business = Tables<"businesses">;
export type ParkingSpot = Tables<"parking_spots">;
export type ParkingSession = Tables<"parking_sessions">;
export type Payment = Tables<"payments">;
export type Reservation = Tables<"reservations">;
export type ActivityLog = Tables<"activity_logs">;
export type Notification = Tables<"notifications">;

export type ProfileInsert = TablesInsert<"profiles">;
export type BusinessInsert = TablesInsert<"businesses">;
export type ParkingSpotInsert = TablesInsert<"parking_spots">;
export type ParkingSessionInsert = TablesInsert<"parking_sessions">;
export type PaymentInsert = TablesInsert<"payments">;
export type ReservationInsert = TablesInsert<"reservations">;
export type ActivityLogInsert = TablesInsert<"activity_logs">;
export type NotificationInsert = TablesInsert<"notifications">;

export type ProfileUpdate = TablesUpdate<"profiles">;
export type BusinessUpdate = TablesUpdate<"businesses">;
export type ParkingSessionUpdate = TablesUpdate<"parking_sessions">;
export type PaymentUpdate = TablesUpdate<"payments">;
export type ReservationUpdate = TablesUpdate<"reservations">;
export type ActivityLogUpdate = TablesUpdate<"activity_logs">;
export type NotificationUpdate = TablesUpdate<"notifications">;

export type UserRole = Enums<"user_role">;
export type ParkingStatus = Enums<"parking_status">;
export type PaymentStatus = Enums<"payment_status">;
export type VehicleType = Enums<"vehicle_type">;

export type ActiveSession = Database["public"]["Views"] extends {
  active_sessions: { Row: infer T };
}
  ? T
  : never;

export type ParkingSessionWithDetails = ParkingSession & {
  parking_spots: ParkingSpot & {
    businesses: Business;
  };
  profiles?: Profile | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
};

export type ParkingSpotWithBusiness = ParkingSpot & {
  businesses: Business;
  reservations?: Reservation[] | null;
};

export interface ProfileWithBusiness extends Profile {
  businesses?: {
    id: string;
    name: string;
  } | null;
}

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

export interface BusinessFormData {
  name: string;
  description?: string;
  owner_id?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  tax_id?: string;
  business_type?: string;
  is_active?: boolean;
}

export interface ParkingSpotFormData {
  business_id: string;
  spot_number: string;
  spot_type?: VehicleType;
  status?: ParkingStatus;
  is_reserved?: boolean;
  is_handicap_accessible?: boolean;
  is_electric_charging?: boolean;
  width?: number;
  length?: number;
  hourly_rate?: number;
  daily_rate?: number;
  monthly_rate?: number;
}

export interface VehicleCheckInFormData {
  vehiclePlate: string;
  vehicleType: VehicleType;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  startDate?: string;
  startTime?: string;
}

export interface ParkingSessionFormData {
  spot_id: string;
  user_id?: string;
  vehicle_plate: string;
  vehicle_type?: VehicleType;
  notes?: string;
}

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

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

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

export interface ParkingSpotData {
  spot_id: string;
  parking_spots: {
    id: string;
    spot_number: string;
    hourly_rate?: number;
  };
}

export interface SpotDetailsDrawerData {
  spot: ParkingSpotWithBusiness;
  currentCost?: {
    total: number;
    duration: string;
  } | null;
}

export interface CustomerInfo {
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

export type CustomerInfoInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};
