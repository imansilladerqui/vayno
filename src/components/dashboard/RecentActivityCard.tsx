import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getActivityIcon,
  getActivityColor,
  getActivityDescription,
} from "@/lib/activityHelpers";
import type { ActivityLogWithProfile } from "@/types";
import { format } from "date-fns";

interface RecentActivityCardProps {
  activities?: Array<{
    id: string;
    action: string;
    table_name: string;
    created_at: string;
    profiles?: {
      full_name?: string;
    };
  }>;
  onViewAll?: () => void;
  limit?: number;
}

export const RecentActivityCard = ({
  activities,
  onViewAll,
  limit = 5,
}: RecentActivityCardProps) => {
  if (!activities || activities.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-1">
              Activity will appear here as users interact with the system.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedActivities = activities.slice(0, limit);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Recent Activity</CardTitle>
          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-white hover:bg-white/10"
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={onViewAll}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      getActivityColor(activity.action)
                    )}
                  >
                    {getActivityIcon(activity.action)}
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {getActivityDescription(
                        activity as ActivityLogWithProfile
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.profiles?.full_name || "System"} •{" "}
                      {activity.table_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {activity.created_at
                    ? format(new Date(activity.created_at), "MMM dd, HH:mm")
                    : "Just now"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
