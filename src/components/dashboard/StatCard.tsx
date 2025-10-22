import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) => {
  const variantStyles = {
    default: "from-primary to-primary/80",
    success: "from-success to-success/80",
    warning: "from-warning to-warning/80",
    danger: "from-destructive to-destructive/80",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {trend && (
              <p
                className={cn(
                  "text-sm mt-2 font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.value}
              </p>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br shadow-md",
              variantStyles[variant]
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
