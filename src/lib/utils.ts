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
 * Common error handling wrapper for async operations
 * @param operation - The async operation to execute
 * @param onError - Optional callback for error handling
 * @returns The result of the operation or undefined if error
 */
export const handleAsync = async <T>(
  operation: () => Promise<T>,
  onError?: (error: unknown) => void
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    if (onError) {
      onError(error);
    }
    return undefined;
  }
};

/**
 * Common routes used throughout the application
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PARKING: "/parking",
  SETTINGS: "/settings",
  SIGNUP: "/signup",
  USERS: "/users",
  EDIT_USER: "/users/:id/edit",
  BUSINESSES: "/businesses",
} as const;

/**
 * User roles constants
 */
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

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

/**
 * Format a timestamp as a relative time string (e.g., "5 mins ago", "2 hours ago")
 * @param timestamp - ISO timestamp string
 * @returns Human-readable relative time string
 */
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export const formatDurationMsToHoursAndMinutes = (
  milliseconds: number
): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
