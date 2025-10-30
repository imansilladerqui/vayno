import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RouteLoadingStateProps {
  /**
   * Optional custom message to display below the spinner
   * @default "Loading..."
   */
  message?: string;
}

/**
 * Full-screen loading state component for route guards
 * Displays a centered spinner with loading message
 */
export const RouteLoadingState = ({
  message = "Loading...",
}: RouteLoadingStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="xl" variant="primary" text={message} centered />
    </div>
  );
};
