import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParkingManagement } from "@/hooks/useParkingManagement";
import { useAuthContext } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Clock,
  ArrowDownCircle,
  ArrowUpCircle,
  Car,
  DollarSign,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  getActivityIcon,
  getActivityColor,
  getActivityDescription,
} from "@/lib/activityHelpers";
import type { ActivityLogWithProfile } from "@/types";

const Activity = () => {
  const { isSuperAdmin } = useAuthContext();
  const { activities, isLoadingActivities: isLoading } = useParkingManagement();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading activity logs..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activities</CardTitle>
              <Badge variant="outline">
                {activities?.length || 0} total logs
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities?.map((activity: ActivityLogWithProfile) => {
                if (isSuperAdmin) {
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={cn(
                          "p-3 rounded-full",
                          getActivityColor(activity.action)
                        )}
                      >
                        {getActivityIcon(activity.action)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-sm">
                            {getActivityDescription(activity)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {activity.action}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-medium">
                            {activity.profiles?.full_name || "System"}
                          </span>
                          <span>•</span>
                          <span>{activity.table_name}</span>
                          {activity.record_id && (
                            <>
                              <span>•</span>
                              <span className="font-mono">
                                {activity.record_id.slice(0, 8)}...
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        {activity.created_at
                          ? format(
                              new Date(activity.created_at),
                              "MMM dd, yyyy HH:mm"
                            )
                          : "Just now"}
                      </div>
                    </div>
                  );
                }

                const isCheckIn =
                  activity.action === "INSERT" &&
                  activity.table_name === "parking_sessions";
                const isCheckOut =
                  activity.action === "UPDATE" &&
                  activity.table_name === "parking_sessions";

                if (!isCheckIn && !isCheckOut) return null;

                const newValues =
                  (activity.new_values as Record<string, unknown> | null) || {};
                const oldValues =
                  (activity.old_values as Record<string, unknown> | null) || {};
                const vehiclePlate = (newValues["vehicle_plate"] ||
                  oldValues["vehicle_plate"] ||
                  "Unknown") as string;
                const spotId = (newValues["spot_id"] ||
                  oldValues["spot_id"] ||
                  "") as string;
                const duration = newValues["duration"] as string | undefined;
                const amount = newValues["total_amount"] as number | undefined;

                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={
                        isCheckIn
                          ? "p-3 rounded-full bg-success/20"
                          : "p-3 rounded-full bg-accent/20"
                      }
                    >
                      {isCheckIn ? (
                        <ArrowDownCircle className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowUpCircle className="h-5 w-5 text-accent" />
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Badge
                          variant={isCheckIn ? "default" : "secondary"}
                          className={
                            isCheckIn ? "bg-success hover:bg-success" : ""
                          }
                        >
                          {isCheckIn ? "entry" : "exit"}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          Spot {spotId ? spotId.slice(0, 8) : "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">
                          {vehiclePlate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {activity.created_at
                            ? format(
                                new Date(activity.created_at),
                                "MMM dd, yyyy HH:mm"
                              )
                            : "Just now"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        {duration && (
                          <span className="text-sm text-muted-foreground">
                            {duration}
                          </span>
                        )}
                        {amount && (
                          <div className="flex items-center gap-1 font-semibold text-sm">
                            <DollarSign className="h-4 w-4" />$
                            {amount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!activities || activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activity logs found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Activity will appear here as users interact with the system.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
