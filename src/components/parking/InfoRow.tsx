import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface InfoRowProps {
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  label: string;
  value?: ReactNode;
  secondary?: ReactNode;
  tertiary?: ReactNode;
}

export const InfoRow = ({
  icon: Icon,
  iconBg = "bg-blue-100 dark:bg-blue-900/20",
  iconColor = "text-blue-600 dark:text-blue-400",
  label,
  value,
  secondary,
  tertiary,
}: InfoRowProps) => {
  if (!value && !secondary && !tertiary) return null;

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        {value && <p className="font-medium">{value}</p>}
        {secondary && (
          <p className="text-xs text-muted-foreground">{secondary}</p>
        )}
        {tertiary && (
          <p className="text-xs text-muted-foreground">{tertiary}</p>
        )}
      </div>
    </div>
  );
};
