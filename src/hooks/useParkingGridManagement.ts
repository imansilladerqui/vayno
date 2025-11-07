import { useMemo, useState } from "react";
import { useParkingSpotsQuery } from "@/hooks/queries/useParkingQueries";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";
import { PARKING_STATUS } from "@/lib/utils";

export const useParkingGridManagement = (businessId: string) => {
  const [selectedBusinessId, setSelectedBusinessId] =
    useState<string>(businessId);

  const { data: parkingSpots } = useParkingSpotsQuery(selectedBusinessId);
  const { businesses } = useBusinessManagement();

  const statusCounts = useMemo(
    () =>
      (parkingSpots ?? []).reduce<Record<string, number>>((acc, spot) => {
        const status = spot.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),
    [parkingSpots]
  );

  const totalSpots = useMemo(() => parkingSpots?.length || 0, [parkingSpots]);

  const occupiedSpots = useMemo(
    () => statusCounts[PARKING_STATUS.OCCUPIED] || 0,
    [statusCounts]
  );

  const reservedSpots = useMemo(
    () => statusCounts[PARKING_STATUS.RESERVED] || 0,
    [statusCounts]
  );

  const availableSpots = useMemo(
    () => statusCounts[PARKING_STATUS.AVAILABLE] || 0,
    [statusCounts]
  );

  const maintenanceSpots = useMemo(
    () => statusCounts[PARKING_STATUS.MAINTENANCE] || 0,
    [statusCounts]
  );

  const rate = useMemo(
    () => (totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0),
    [totalSpots, occupiedSpots]
  );

  const businessesList = useMemo(
    () => (businesses as Array<{ id: string; name: string }>) || [],
    [businesses]
  );

  return {
    parkingSpots,
    totalSpots,
    rate,
    reservedSpots,
    maintenanceSpots,
    availableSpots,
    occupiedSpots,
    statusCounts,

    selectedBusinessId,
    setSelectedBusinessId,
    businessesList,
  };
};
