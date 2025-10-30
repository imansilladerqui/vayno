import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RouteLoadingState } from "@/components/RouteLoadingState";

import { PublicRoutes } from "./public";
import { ProtectedRoutes } from "./protected";
import { FeatureRoutes } from "./features";

const NotFound = lazy(() => import("@/pages/NotFound"));

const PageLoader = () => <RouteLoadingState />;
export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {PublicRoutes()}
        {ProtectedRoutes()}
        {FeatureRoutes()}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
