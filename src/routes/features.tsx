import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/lib/utils";

const Users = lazy(() => import("@/pages/Users"));
const UserDetail = lazy(() => import("@/pages/UserDetail"));
const CreateUser = lazy(() => import("@/pages/CreateUser"));
const EditUser = lazy(() => import("@/pages/EditUser"));
const Businesses = lazy(() => import("@/pages/Businesses"));
const BusinessDetail = lazy(() => import("@/pages/BusinessDetail"));
const CreateBusiness = lazy(() => import("@/pages/CreateBusiness"));
const EditBusiness = lazy(() => import("@/pages/EditBusiness"));

export const FeatureRoutes = () => {
  return [
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
      path={ROUTES.USER_NEW}
      element={
        <ProtectedRoute>
          <CreateUser />
        </ProtectedRoute>
      }
    />,
    <Route
      key="users-edit"
      path={ROUTES.USER_EDIT}
      element={
        <ProtectedRoute>
          <EditUser />
        </ProtectedRoute>
      }
    />,
    <Route
      key="user-detail"
      path={ROUTES.USER_DETAIL}
      element={
        <ProtectedRoute>
          <UserDetail />
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
      key="businesses-detail"
      path={ROUTES.BUSINESS_DETAIL}
      element={
        <ProtectedRoute>
          <BusinessDetail />
        </ProtectedRoute>
      }
    />,
    <Route
      key="businesses-new"
      path={ROUTES.BUSINESS_NEW}
      element={
        <ProtectedRoute>
          <CreateBusiness />
        </ProtectedRoute>
      }
    />,
    <Route
      key="businesses-edit"
      path={ROUTES.BUSINESS_EDIT}
      element={
        <ProtectedRoute>
          <EditBusiness />
        </ProtectedRoute>
      }
    />,
  ];
};
