import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/lib/utils";

const Dashboard = lazy(() => import("@/pages/Dashboard"));

export const ProtectedRoutes = () => {
  return [
    <Route
      key="dashboard"
      path={ROUTES.DASHBOARD}
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />,
  ];
};
