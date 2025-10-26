import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DatabaseService,
  type ParkingLotUpdate,
  type ParkingSpotUpdate,
} from "@/lib/database";

// Query Keys - Centralized for consistency
export const parkingQueryKeys = {
  parkingLots: ["parking-lots"] as const,
  parkingLot: (id: string) => ["parking-lot", id] as const,
  parkingSpots: (lotId?: string) => ["parking-spots", lotId] as const,
  parkingSpot: (id: string) => ["parking-spot", id] as const,
  parkingSessions: (filters?: {
    userId?: string;
    spotId?: string;
    activeOnly?: boolean;
  }) => ["parking-sessions", filters] as const,
  activeSessions: ["active-sessions"] as const,
  activityLogs: ["activity-logs"] as const,
};

// Parking Lots Hooks
export const useParkingLots = () => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingLots,
    queryFn: DatabaseService.getParkingLots,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useParkingLot = (id: string) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingLot(id),
    queryFn: () => DatabaseService.getParkingLot(id),
    enabled: !!id,
    retry: 3,
  });
};

export const useCreateParkingLot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DatabaseService.createParkingLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parkingQueryKeys.parkingLots });
      queryClient.invalidateQueries({ queryKey: ["parking-lot-stats"] });
      toast.success("Parking lot created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create parking lot: ${error.message}`);
    },
  });
};

export const useUpdateParkingLot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ParkingLotUpdate }) =>
      DatabaseService.updateParkingLot(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: parkingQueryKeys.parkingLots });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingLot(data.id),
      });
      queryClient.invalidateQueries({ queryKey: ["parking-lot-stats"] });
      toast.success("Parking lot updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update parking lot: ${error.message}`);
    },
  });
};

// Parking Spots Hooks
export const useParkingSpots = (lotId?: string) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingSpots(lotId),
    queryFn: () => DatabaseService.getParkingSpots(lotId),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
};

export const useParkingSpot = (id: string) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingSpot(id),
    queryFn: () => DatabaseService.getParkingSpot(id),
    enabled: !!id,
    retry: 3,
  });
};

export const useUpdateParkingSpot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ParkingSpotUpdate>;
    }) => DatabaseService.updateParkingSpot(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingSpots(),
      });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingSpot(data.id),
      });
      queryClient.invalidateQueries({ queryKey: ["occupancy-stats"] });
      toast.success("Parking spot updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update parking spot: ${error.message}`);
    },
  });
};

export const useCreateParkingSpots = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DatabaseService.createParkingSpots,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingSpots(),
      });
      queryClient.invalidateQueries({ queryKey: ["occupancy-stats"] });
      toast.success("Parking spots created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create parking spots: ${error.message}`);
    },
  });
};

// Parking Sessions Hooks
export const useParkingSessions = (filters?: {
  userId?: string;
  spotId?: string;
  activeOnly?: boolean;
}) => {
  return useQuery({
    queryKey: parkingQueryKeys.parkingSessions(filters),
    queryFn: () => DatabaseService.getParkingSessions(filters),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: parkingQueryKeys.activeSessions,
    queryFn: DatabaseService.getActiveSessions,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 3,
  });
};

export const useCheckInVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      spotId,
      vehiclePlate,
      userId,
      vehicleType = "car",
    }: {
      spotId: string;
      vehiclePlate: string;
      userId?: string;
      vehicleType?: "car" | "motorcycle" | "truck" | "van" | "other";
    }) =>
      DatabaseService.checkInVehicle(spotId, vehiclePlate, userId, vehicleType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingSessions(),
      });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.activeSessions,
      });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingSpots(),
      });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.activityLogs,
      });
      queryClient.invalidateQueries({ queryKey: ["occupancy-stats"] });
      toast.success("Vehicle checked in successfully");
    },
    onError: (error) => {
      toast.error(`Failed to check in vehicle: ${error.message}`);
    },
  });
};

export const useCheckOutVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      paymentMethod = "cash",
    }: {
      sessionId: string;
      paymentMethod?: string;
    }) => DatabaseService.checkOutVehicle(sessionId, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingSessions(),
      });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.activeSessions,
      });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.parkingSpots(),
      });
      queryClient.invalidateQueries({
        queryKey: parkingQueryKeys.activityLogs,
      });
      queryClient.invalidateQueries({ queryKey: ["today-revenue"] });
      queryClient.invalidateQueries({ queryKey: ["occupancy-stats"] });
      toast.success("Vehicle checked out successfully");
    },
    onError: (error) => {
      toast.error(`Failed to check out vehicle: ${error.message}`);
    },
  });
};

// Activity Logs Hooks
export const useActivityLogs = (limit = 50) => {
  return useQuery({
    queryKey: parkingQueryKeys.activityLogs,
    queryFn: () => DatabaseService.getActivityLogs(limit),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
};

// Business Logic Hooks
export const useCalculateCurrentCost = () => {
  return useMutation({
    mutationFn: DatabaseService.calculateCurrentCost,
    onError: (error) => {
      toast.error(`Failed to calculate cost: ${error.message}`);
    },
  });
};
