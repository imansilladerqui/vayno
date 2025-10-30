import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { ROUTES } from "@/lib/utils";
import { RouteLoadingState } from "@/components/RouteLoadingState";

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <RouteLoadingState />;
  }

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
