import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "./RoleGuard";
import Dashboard from "@/components/layout/Dashboard";

// staff or users dashboard pages
import MemberRecords from "@/features/staff/page/MemberRecords";
import StaffAnalyticsPage from "@/features/staff/page/StaffDashboard";

const StaffRoutes: RouteObject[] = [
  {
    path: "/staff",
    element: (
      <RoleGuard allowedRoles={["staff"]}>
        <Dashboard />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <StaffAnalyticsPage /> },
      { path: "members", element: <MemberRecords /> },
    ],
  },
];
export default StaffRoutes;
