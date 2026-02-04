import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "./RoleGuard";
import Dashboard from "@/components/layout/Dashboard";

// admin dashboard pages
import Members from "@/features/admin/pages/Members.page";
import Bills from "@/features/admin/pages/Bills.page";
import Reports from "@/features/admin/pages/Reports.page";
import Diet from "@/features/admin/pages/Diet.page.tsx";
import Supplement from "@/features/admin/pages/Supplement.page";
import FeePackages from "@/features/admin/pages/FeePackage.page";
import Notification from "@/features/admin/pages/Notification.page";
import AdminAnalytics from "@/features/admin/pages/Admin.page";
import StaffPage from "@/features/admin/pages/staff.page";

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <Dashboard />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <AdminAnalytics /> },
      { path: "members", element: <Members /> },
      { path: "billing/list", element: <Bills /> },
      { path: "packages", element: <FeePackages /> },
      { path: "staffs", element: <StaffPage /> },
      { path: "diets", element: <Diet /> },
      { path: "supplement", element: <Supplement /> },
      { path: "notifications", element: <Notification /> },
    ],
  },
];
export default AdminRoutes;
