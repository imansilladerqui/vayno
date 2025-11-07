import { Badge } from "@/components/ui/badge";
import type { ParkingStatus } from "@/types";

interface ParkingStatusBadgeProps {
  status: ParkingStatus | string;
  className?: string;
}

export const ParkingStatusBadge = ({
  status,
  className,
}: ParkingStatusBadgeProps) => {
  const variantMap: Record<
    string,
    "default" | "destructive" | "secondary" | "outline"
  > = {
    available: "default",
    occupied: "destructive",
    reserved: "secondary",
    maintenance: "outline",
  };

  const colorMap: Record<string, string> = {
    available: "bg-success hover:bg-success",
    reserved: "bg-warning hover:bg-warning",
  };

  return (
    <Badge
      variant={variantMap[status] || "outline"}
      className={
        colorMap[status] ? `${colorMap[status]} ${className || ""}` : className
      }
    >
      {status}
    </Badge>
  );
};
