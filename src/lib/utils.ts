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
  ACTIVITY: "/activity",
  SETTINGS: "/settings",
  SIGNUP: "/signup",
  USERS: "/users",
  EDIT_USER: "/users/:id/edit",
  BUSINESSES: "/businesses",
} as const;

/**
 * Delay helper for timed operations
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
