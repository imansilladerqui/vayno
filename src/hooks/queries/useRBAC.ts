import { useQuery } from "@tanstack/react-query";
import { RBACService } from "@/lib/rbacService";

export const useHasPermission = (userId: string, permission: string) => {
  return useQuery({
    queryKey: ["permission", userId, permission],
    queryFn: () => RBACService.hasPermission(userId, permission),
    enabled: !!userId && !!permission,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useUserFeatures = (userId: string) => {
  return useQuery({
    queryKey: ["user-features", userId],
    queryFn: () => RBACService.getUserFeatures(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useCanManageParking = (userId: string) => {
  return useQuery({
    queryKey: ["can-manage-parking", userId],
    queryFn: () => RBACService.canManageParking(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useCanViewReports = (userId: string) => {
  return useQuery({
    queryKey: ["can-view-reports", userId],
    queryFn: () => RBACService.canViewReports(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useCanManageUsers = (userId: string) => {
  return useQuery({
    queryKey: ["can-manage-users", userId],
    queryFn: () => RBACService.canManageUsers(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
