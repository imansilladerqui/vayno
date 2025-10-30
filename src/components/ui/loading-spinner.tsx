import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /**
   * Size variant of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Text color variant
   * @default "primary"
   */
  variant?: "primary" | "muted" | "destructive" | "default";
  /**
   * Additional className for the spinner
   */
  className?: string;
  /**
   * Optional text to display below the spinner
   */
  text?: string;
  /**
   * Whether to center the spinner
   * @default false
   */
  centered?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const variantClasses = {
  primary: "text-primary",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
  default: "text-foreground",
};

/**
 * Centralized loading spinner component with size variants
 * Provides consistent loading indicators across the application
 */
export const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  className,
  text,
  centered = false,
}: LoadingSpinnerProps) => {
  const spinner = (
    <Loader2
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );

  if (text) {
    return (
      <div
        className={cn("text-center", centered && "flex flex-col items-center")}
      >
        <div className={centered ? "" : "flex justify-center"}>{spinner}</div>
        <p className={cn("mt-4", variantClasses.muted)}>{text}</p>
      </div>
    );
  }

  if (centered) {
    return <div className="flex items-center justify-center">{spinner}</div>;
  }

  return spinner;
};
