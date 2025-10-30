import { Route } from "react-router-dom";
import { lazy } from "react";
import GuestRoute from "@/components/GuestRoute";
import { ROUTES } from "@/lib/utils";

const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));

export const PublicRoutes = () => {
  return [
    <Route key="home" path={ROUTES.HOME} element={<Index />} />,
    <Route
      key="login"
      path={ROUTES.LOGIN}
      element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      }
    />,
    <Route
      key="signup"
      path={ROUTES.SIGNUP}
      element={
        <GuestRoute>
          <Signup />
        </GuestRoute>
      }
    />,
  ];
};
