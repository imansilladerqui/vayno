import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Standard entity action messages for toasts
 */
export const EntityMessages = {
  created: (entityName: string) => `${entityName} created successfully`,
  updated: (entityName: string) => `${entityName} updated successfully`,
  deleted: (entityName: string) => `${entityName} deleted successfully`,
  failedToCreate: (entityName: string) =>
    `Failed to create ${entityName.toLowerCase()}`,
  failedToUpdate: (entityName: string) =>
    `Failed to update ${entityName.toLowerCase()}`,
  failedToDelete: (entityName: string) =>
    `Failed to delete ${entityName.toLowerCase()}`,
} as const;

/**
 * Standard entity names (capitalized, singular)
 */
export const EntityNames = {
  User: "User",
  Business: "Business",
  ParkingLot: "Parking lot",
  ParkingSpot: "Parking spot",
  ParkingSpots: "Parking spots",
  ParkingSession: "Parking session",
  Vehicle: "Vehicle",
} as const;

/**
 * Type for query keys that can be invalidated
 */
export type QueryKeyToInvalidate = readonly unknown[] | string;

/**
 * Configuration for invalidating queries by prefix
 */
export interface InvalidatePrefixConfig {
  type: "prefix";
  key: readonly unknown[];
}

/**
 * Type for invalidate keys - supports individual keys, arrays, prefixes, or functions
 */
export type InvalidateKeyConfig =
  | QueryKeyToInvalidate
  | InvalidatePrefixConfig
  | QueryKeyToInvalidate[]
  | ((data: unknown, variables: unknown) => InvalidateKeyConfig[]);

/**
 * Efficiently invalidate multiple query keys
 * Supports individual keys, arrays of keys, and prefix-based invalidation
 *
 * @param queryClient - React Query client instance
 * @param keys - Single key, array of keys, or prefix config
 */
export function invalidateQueryKeys(
  queryClient: ReturnType<typeof useQueryClient>,
  keys: InvalidateKeyConfig
): void {
  const keysArray = Array.isArray(keys) ? keys : [keys];

  for (const key of keysArray) {
    if (
      typeof key === "object" &&
      key !== null &&
      "type" in key &&
      key.type === "prefix"
    ) {
      // Invalidate all queries that start with this prefix
      queryClient.invalidateQueries({ queryKey: key.key, exact: false });
    } else {
      // Invalidate exact match
      queryClient.invalidateQueries({ queryKey: key as QueryKey });
    }
  }
}

/**
 * Hook to get a function for invalidating multiple query keys
 * Useful for manual invalidation outside of mutations
 */
export function useInvalidateQueryKeys() {
  const queryClient = useQueryClient();

  return (keys: InvalidateKeyConfig) => {
    invalidateQueryKeys(queryClient, keys);
  };
}

/**
 * Options for creating CRUD mutations
 */
export interface CrudMutationOptions<TData, TError = Error, TVariables = void> {
  /**
   * Query keys to invalidate on success
   * Can be:
   * - A single key (exact match)
   * - An array of keys (exact matches)
   * - A prefix config ({ type: "prefix", key: [...] }) to invalidate all queries starting with that prefix
   * - A function that returns keys based on mutation result/variables
   * - A mixed array of keys and prefix configs
   */
  invalidateKeys:
    | InvalidateKeyConfig
    | ((data: TData, variables: TVariables) => InvalidateKeyConfig[]);

  /**
   * Entity name for toast messages (e.g., "User", "Business")
   */
  entityName: string;

  /**
   * Action type: "create", "update", "delete", or custom action
   */
  action:
    | "create"
    | "update"
    | "delete"
    | "check in"
    | "check out"
    | "mark as read"
    | "change password"
    | "reset password"
    | "sign up"
    | "sign in"
    | "sign out";

  /**
   * Custom success message (optional)
   */
  successMessage?: string;

  /**
   * Custom error message prefix (optional)
   */
  errorMessagePrefix?: string;

  /**
   * Additional onSuccess callback (optional)
   */
  onSuccess?: (data: TData, variables: TVariables) => void;

  /**
   * Additional onError callback (optional)
   */
  onError?: (error: TError, variables: TVariables) => void;
}

/**
 * Hook helper for creating CRUD mutations with standardized handling
 * Returns mutation configuration that can be spread into useMutation
 */
export function useCrudMutationConfig<TData, TError = Error, TVariables = void>(
  options: CrudMutationOptions<TData, TError, TVariables>
) {
  const queryClient = useQueryClient();
  const {
    invalidateKeys,
    entityName,
    action,
    successMessage,
    errorMessagePrefix,
    onSuccess: customOnSuccess,
    onError: customOnError,
  } = options;

  return {
    onSuccess: (data: TData, variables: TVariables) => {
      const keysToInvalidate =
        typeof invalidateKeys === "function"
          ? invalidateKeys(data, variables)
          : invalidateKeys;

      invalidateQueryKeys(queryClient, keysToInvalidate);

      const message =
        successMessage ||
        (action === "create"
          ? EntityMessages.created(entityName)
          : action === "update"
          ? EntityMessages.updated(entityName)
          : action === "delete"
          ? EntityMessages.deleted(entityName)
          : action === "check in"
          ? `${entityName} checked in successfully`
          : action === "check out"
          ? `${entityName} checked out successfully`
          : `${entityName} ${action}d successfully`);

      toast.success(message);

      if (customOnSuccess) {
        customOnSuccess(data, variables);
      }
    },
    onError: (error: TError, variables: TVariables) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      const prefix =
        errorMessagePrefix ||
        (action === "create"
          ? EntityMessages.failedToCreate(entityName)
          : action === "update"
          ? EntityMessages.failedToUpdate(entityName)
          : action === "delete"
          ? EntityMessages.failedToDelete(entityName)
          : `Failed to ${action} ${entityName.toLowerCase()}`);

      toast.error(prefix + (errorMessage ? `: ${errorMessage}` : ""));

      if (customOnError) {
        customOnError(error, variables);
      }
    },
  };
}
