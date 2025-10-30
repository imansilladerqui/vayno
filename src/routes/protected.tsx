import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/lib/utils";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Activity = lazy(() => import("@/pages/Activity"));
const Settings = lazy(() => import("@/pages/Settings"));

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
    <Route
      key="activity"
      path={ROUTES.ACTIVITY}
      element={
        <ProtectedRoute>
          <Activity />
        </ProtectedRoute>
      }
    />,
    <Route
      key="settings"
      path={ROUTES.SETTINGS}
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />,
  ];
};
