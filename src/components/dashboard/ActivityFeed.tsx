import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityLogs } from "@/hooks/queries/useParking";
import type { ActivityLog } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ActivityFeed = () => {
  const { data: activities, isLoading, error } = useActivityLogs(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Loading activity logs...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load activity logs. Please check your connection.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-1">
              Activity will appear here as users interact with the system.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "insert":
        return <ArrowDownCircle className="h-4 w-4" />;
      case "update":
        return <ArrowUpCircle className="h-4 w-4" />;
      case "delete":
        return <ArrowUpCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "insert":
        return "bg-success/20 text-success";
      case "update":
        return "bg-accent/20 text-accent";
      case "delete":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getActivityDescription = (activity: ActivityLog) => {
    if (activity.description) {
      return activity.description;
    }

    const action = activity.action.toLowerCase();
    const tableName = activity.table_name;

    switch (tableName) {
      case "parking_sessions":
        if (action === "insert") return "Vehicle checked in";
        if (action === "update") return "Parking session updated";
        if (action === "delete") return "Parking session deleted";
        break;
      case "parking_spots":
        if (action === "insert") return "Parking spot created";
        if (action === "update") return "Parking spot status changed";
        if (action === "delete") return "Parking spot removed";
        break;
      case "parking_lots":
        if (action === "insert") return "Parking lot created";
        if (action === "update") return "Parking lot updated";
        if (action === "delete") return "Parking lot deleted";
        break;
      default:
        return `${action} on ${tableName}`;
    }

    return `${action} on ${tableName}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest {activities.length} activities
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div
                className={cn(
                  "p-2 rounded-full",
                  getActivityColor(activity.action)
                )}
              >
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {getActivityDescription(activity)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.table_name && activity.record_id && (
                    <>
                      {activity.table_name} • {activity.record_id.slice(0, 8)}
                      ...
                    </>
                  )}
                  {activity.profiles?.full_name && (
                    <> • {activity.profiles.full_name}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="h-3 w-3" />
                {activity.created_at
                  ? formatTimeAgo(activity.created_at)
                  : "Just now"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
