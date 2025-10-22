import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "entry" | "exit";
  spotNumber: number;
  vehicle: string;
  time: string;
}

const mockActivities: Activity[] = [
  { id: "1", type: "entry", spotNumber: 12, vehicle: "ABC-1234", time: "2 mins ago" },
  { id: "2", type: "exit", spotNumber: 5, vehicle: "XYZ-5678", time: "5 mins ago" },
  { id: "3", type: "entry", spotNumber: 23, vehicle: "DEF-9012", time: "8 mins ago" },
  { id: "4", type: "exit", spotNumber: 18, vehicle: "GHI-3456", time: "12 mins ago" },
  { id: "5", type: "entry", spotNumber: 7, vehicle: "JKL-7890", time: "15 mins ago" },
];

export const ActivityFeed = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div
                className={cn(
                  "p-2 rounded-full",
                  activity.type === "entry"
                    ? "bg-success/20 text-success"
                    : "bg-accent/20 text-accent"
                )}
              >
                {activity.type === "entry" ? (
                  <ArrowDownCircle className="h-4 w-4" />
                ) : (
                  <ArrowUpCircle className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {activity.type === "entry" ? "Vehicle Entered" : "Vehicle Exited"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Spot #{activity.spotNumber} • {activity.vehicle}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
