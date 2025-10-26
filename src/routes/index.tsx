import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/lib/utils";

// Lazy loaded pages
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Parking = lazy(() => import("@/pages/Parking"));
const Activity = lazy(() => import("@/pages/Activity"));
const Settings = lazy(() => import("@/pages/Settings"));
const Users = lazy(() => import("@/pages/Users"));
const EditUser = lazy(() => import("@/pages/EditUser"));
const Businesses = lazy(() => import("@/pages/Businesses"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Index />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PARKING}
        element={
          <ProtectedRoute>
            <Parking />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ACTIVITY}
        element={
          <ProtectedRoute>
            <Activity />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.USERS}
        element={
          <ProtectedRoute requireSuperAdmin>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/edit"
        element={
          <ProtectedRoute requireSuperAdmin>
            <EditUser />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.BUSINESSES}
        element={
          <ProtectedRoute requireSuperAdmin>
            <Businesses />
          </ProtectedRoute>
        }
      />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
