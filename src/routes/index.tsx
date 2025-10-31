import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { PublicRoutes } from "./public";
import { ProtectedRoutes } from "./protected";
import { FeatureRoutes } from "./features";

const NotFound = lazy(() => import("@/pages/NotFound"));

const PageLoader = () => null;
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
