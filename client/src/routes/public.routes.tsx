import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

// layout
import LandingLayout from "@/components/layout/landing.layout";

/* ---------------------- Lazy Pages ---------------------- */

const LandingPage = lazy(() => import("@/features/common/Landing.pages"));

/* ------------------------ Routes ------------------------ */

const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LandingPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default PublicRoutes;
