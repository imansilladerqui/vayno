import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility functions for error handling and common operations
 */

/**
 * Extracts an error message from an unknown error type
 * @param error - The error to extract message from
 * @param defaultMessage - Default message if error doesn't have a message
 * @returns The error message
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage = "An error occurred"
): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return defaultMessage;
};

/**
 * Common routes used throughout the application
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  SIGNUP: "/signup",
  USERS: "/users",
  USER_NEW: "/users/new",
  USER_DETAIL: "/users/:id",
  USER_EDIT: "/users/:id/edit",
  BUSINESSES: "/businesses",
  BUSINESS_NEW: "/businesses/new",
  BUSINESS_DETAIL: "/business/:id",
  BUSINESS_EDIT: "/business/:id/edit",
} as const;

/**
 * User roles constants
 */
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

/**
 * Parking status constants
 */
export const PARKING_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
  MAINTENANCE: "maintenance",
} as const;

/**
 * Delay helper for timed operations
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Get user initials from a name string
 * @param name - The full name string
 * @returns The first letters of each word, up to 2 characters
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatDurationMsToHoursAndMinutes = (
  milliseconds: number
): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Format the elapsed time since a check-in timestamp.
 * @param date - The original check-in time.
 * @returns Formatted string like "2d 5h", "3h 15m", or "45m".
 */
export const formatTimeDifference = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs <= 0) return "Now";

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m`;
  }
  return `${diffMins}m`;
};

/**
 * Format the time until a target date.
 * @param target - The target date.
 * @param prefix - Optional label prefix (defaults to "Ends in").
 * @returns Formatted string like "2d 5h", "3h 15m", or "45m".
 */
export const formatTimeUntil = (
  target: Date,
  prefix: string = "Ends in"
): string | null => {
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  // Treat far-future placeholders (e.g., open-ended reservations) as no countdown
  const yearsAhead = diffMs / (1000 * 60 * 60 * 24 * 365);
  if (yearsAhead >= 50) return null;

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${prefix} ${diffDays}d ${diffHours % 24}h`;
  }
  if (diffHours > 0) {
    return `${prefix} ${diffHours}h ${diffMins % 60}m`;
  }
  return `${prefix} ${diffMins}m`;
};

export const parseCustomerInfoFromNotes = (
  session: { notes?: string | null } & {
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_email?: string | null;
  }
): void => {
  if (session.notes) {
    try {
      const notesStr = String(session.notes).trim();
      if (notesStr.startsWith("{") && notesStr.endsWith("}")) {
        const customerData = JSON.parse(notesStr);
        if (
          customerData.customer_name &&
          typeof customerData.customer_name === "string" &&
          customerData.customer_name.trim()
        ) {
          session.customer_name = customerData.customer_name.trim();
        }
        if (
          customerData.customer_phone &&
          typeof customerData.customer_phone === "string" &&
          customerData.customer_phone.trim()
        ) {
          session.customer_phone = customerData.customer_phone.trim();
        }
        if (
          customerData.customer_email &&
          typeof customerData.customer_email === "string" &&
          customerData.customer_email.trim()
        ) {
          session.customer_email = customerData.customer_email.trim();
        }
      }
    } catch {
      // Ignore parsing errors - notes might contain other data
    }
  }
};

export const DATE_FORMAT = "MMM dd, yyyy HH:mm";

export const normalizeVehiclePlate = (plate: string): string => {
  return plate.trim().toUpperCase();
};

export const normalizeCustomerInfo = (info: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}): {
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
} => {
  return {
    customer_name: info.name?.trim() || null,
    customer_email: info.email?.trim() || null,
    customer_phone: info.phone?.trim() || null,
  };
};

export const hasCustomerInfo = (info: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}): boolean => {
  return !!(
    (info.name && info.name.trim()) ||
    (info.email && info.email.trim()) ||
    (info.phone && info.phone.trim())
  );
};

export const createCustomerInfoJson = (info: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}): string | null => {
  if (!hasCustomerInfo(info)) return null;
  return JSON.stringify(normalizeCustomerInfo(info));
};

export const getSpotHourlyRate = (spot: Record<string, unknown>): number => {
  return (typeof spot?.hourly_rate === "number" ? spot.hourly_rate : null) ?? 0;
};

export const createFarFutureDate = (
  fromDate: Date = new Date(),
  years: number = 100
): Date => {
  const future = new Date(fromDate);
  future.setFullYear(future.getFullYear() + years);
  return future;
};
