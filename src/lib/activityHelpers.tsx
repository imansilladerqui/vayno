import { Clock, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import type { ActivityLogWithProfile } from "@/types";

export const getActivityIcon = (action: string) => {
  switch (action.toLowerCase()) {
    case "insert":
      return <ArrowDownCircle className="h-4 w-4 text-success" />;
    case "update":
      return <ArrowUpCircle className="h-4 w-4 text-accent" />;
    case "delete":
      return <ArrowUpCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export const getActivityColor = (action: string) => {
  switch (action.toLowerCase()) {
    case "insert":
      return "bg-success/20";
    case "update":
      return "bg-accent/20";
    case "delete":
      return "bg-destructive/20";
    default:
      return "bg-muted/20";
  }
};

export const getActivityDescription = (activity: ActivityLogWithProfile) => {
  if (activity.description) {
    return activity.description;
  }
  const action = activity.action.toLowerCase();
  const tableName = activity.table_name;
  return `${action} on ${tableName}`;
};
