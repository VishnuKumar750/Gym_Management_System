import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

import { RoleGuard } from "./RoleGuard";
import Dashboard from "@/components/layout/Dashboard";

/* ---------------------- Lazy Admin Pages ---------------------- */

const Members = lazy(() => import("@/features/admin/Members.page"));
const Bills = lazy(() => import("@/features/admin/Bills.page"));
const Diet = lazy(() => import("@/features/admin/Diet.page"));
const Supplement = lazy(() => import("@/features/admin/Supplement.page"));
const FeePackages = lazy(() => import("@/features/admin/FeePackage.page"));
const Notification = lazy(() => import("@/features/admin/Notification.page"));
const AdminAnalytics = lazy(() => import("@/features/admin/Admin.page"));
const StaffPage = lazy(() => import("@/features/admin/staff.page"));

/* -------------------------- Routes ---------------------------- */

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <Dashboard />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminAnalytics />
          </Suspense>
        ),
      },
      {
        path: "members",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Members />
          </Suspense>
        ),
      },
      {
        path: "billing/list",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Bills />
          </Suspense>
        ),
      },
      {
        path: "packages",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <FeePackages />
          </Suspense>
        ),
      },
      {
        path: "staffs",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <StaffPage />
          </Suspense>
        ),
      },
      {
        path: "diets",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Diet />
          </Suspense>
        ),
      },
      {
        path: "supplement",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Supplement />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Notification />
          </Suspense>
        ),
      },
    ],
  },
];

export default AdminRoutes;
