import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

import { RoleGuard } from "./RoleGuard";
import Dashboard from "@/components/layout/Dashboard";

/* ---------------------- Lazy Staff Pages ---------------------- */

const StaffAnalyticsPage = lazy(
  () => import("@/features/staff/StaffDashboard"),
);

const MemberRecords = lazy(() => import("@/features/staff/MemberRecords"));

/* -------------------------- Routes ---------------------------- */

const StaffRoutes: RouteObject[] = [
  {
    path: "/staff",
    element: (
      <RoleGuard allowedRoles={["staff"]}>
        <Dashboard />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <StaffAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: "members",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MemberRecords />
          </Suspense>
        ),
      },
    ],
  },
];

export default StaffRoutes;
