import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Car, Clock, DollarSign } from "lucide-react";

interface ActivityLog {
  id: string;
  type: "entry" | "exit";
  spotNumber: number;
  vehicle: string;
  timestamp: string;
  duration?: string;
  amount?: string;
}

const mockLogs: ActivityLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `log-${i + 1}`,
  type: i % 2 === 0 ? "entry" : "exit",
  spotNumber: Math.floor(Math.random() * 100) + 1,
  vehicle: `ABC-${1000 + i}`,
  timestamp: new Date(Date.now() - i * 1000 * 60 * 15).toLocaleString(),
  duration: i % 2 === 1 ? `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}m` : undefined,
  amount: i % 2 === 1 ? `$${(Math.random() * 20 + 5).toFixed(2)}` : undefined,
}));

const Activity = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground mt-1">
            Complete history of all parking activities
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={
                      log.type === "entry"
                        ? "p-3 rounded-full bg-success/20"
                        : "p-3 rounded-full bg-accent/20"
                    }
                  >
                    {log.type === "entry" ? (
                      <ArrowDownCircle className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowUpCircle className="h-5 w-5 text-accent" />
                    )}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Badge
                        variant={log.type === "entry" ? "default" : "secondary"}
                        className={log.type === "entry" ? "bg-success hover:bg-success" : ""}
                      >
                        {log.type}
                      </Badge>
                      <p className="text-sm font-medium mt-1">Spot #{log.spotNumber}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{log.vehicle}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {log.duration && (
                        <span className="text-sm text-muted-foreground">{log.duration}</span>
                      )}
                      {log.amount && (
                        <div className="flex items-center gap-1 font-semibold text-sm">
                          <DollarSign className="h-4 w-4" />
                          {log.amount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
