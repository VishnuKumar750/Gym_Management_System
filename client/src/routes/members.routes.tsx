import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

import { RoleGuard } from "./RoleGuard";
import Dashboard from "@/components/layout/Dashboard";

/* ---------------------- Lazy Member Pages ---------------------- */

const MemberAnalyticsPage = lazy(
  () => import("@/features/members/MemberDashboard"),
);
const BillReceipts = lazy(() => import("@/features/members/BillReceipts"));
const MemberNotifications = lazy(
  () => import("@/features/members/BillNotification"),
);

/* -------------------------- Routes ----------------------------- */

const MemberRoutes: RouteObject[] = [
  {
    path: "/member",
    element: (
      <RoleGuard allowedRoles={["member"]}>
        <Dashboard />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MemberAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: "bill-reciepts",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <BillReceipts />
          </Suspense>
        ),
      },
      {
        path: "bill-notification",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MemberNotifications />
          </Suspense>
        ),
      },
    ],
  },
];

export default MemberRoutes;
