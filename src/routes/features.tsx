import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/lib/utils";

const Parking = lazy(() => import("@/pages/Parking"));
const Users = lazy(() => import("@/pages/Users"));
const CreateUser = lazy(() => import("@/pages/CreateUser"));
const EditUser = lazy(() => import("@/pages/EditUser"));
const Businesses = lazy(() => import("@/pages/Businesses"));
const CreateBusiness = lazy(() => import("@/pages/CreateBusiness"));
const EditBusiness = lazy(() => import("@/pages/EditBusiness"));

export const FeatureRoutes = () => {
  return [
    <Route
      key="parking"
      path={ROUTES.PARKING}
      element={
        <ProtectedRoute>
          <Parking />
        </ProtectedRoute>
      }
    />,
    <Route
      key="users"
      path={ROUTES.USERS}
      element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      }
    />,
    <Route
      key="users-new"
      path="/users/new"
      element={
        <ProtectedRoute>
          <CreateUser />
        </ProtectedRoute>
      }
    />,
    <Route
      key="users-edit"
      path="/users/:id/edit"
      element={
        <ProtectedRoute>
          <EditUser />
        </ProtectedRoute>
      }
    />,
    <Route
      key="businesses"
      path={ROUTES.BUSINESSES}
      element={
        <ProtectedRoute>
          <Businesses />
        </ProtectedRoute>
      }
    />,
    <Route
      key="businesses-new"
      path="/businesses/new"
      element={
        <ProtectedRoute>
          <CreateBusiness />
        </ProtectedRoute>
      }
    />,
    <Route
      key="businesses-edit"
      path="/businesses/:id/edit"
      element={
        <ProtectedRoute>
          <EditBusiness />
        </ProtectedRoute>
      }
    />,
  ];
};
