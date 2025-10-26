import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DatabaseService } from "@/lib/database";

// Query Keys
export const notificationQueryKeys = {
  notifications: (userId: string) => ["notifications", userId] as const,
};

// Notifications Hooks
export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: notificationQueryKeys.notifications(userId),
    queryFn: () => DatabaseService.getNotifications(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DatabaseService.markNotificationAsRead,
    onSuccess: () => {
      // Invalidate all notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(`Failed to mark notification as read: ${error.message}`);
    },
  });
};
