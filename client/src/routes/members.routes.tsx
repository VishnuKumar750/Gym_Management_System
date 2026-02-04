import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "./RoleGuard";
import Dashboard from "@/components/layout/Dashboard";

// member dashboard pages
import MemberAnalyticsPage from "@/features/members/page/MemberDashboard";
import BillReceipts from "@/features/members/page/BillReceipts";
import MemberNotifications from "@/features/members/page/BillNotification";

const MemberRoutes: RouteObject[] = [
  {
    path: "/member",
    element: (
      <RoleGuard allowedRoles={["member"]}>
        <Dashboard />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <MemberAnalyticsPage /> },
      { path: "bill-reciepts", element: <BillReceipts /> },
      { path: "bill-notification", element: <MemberNotifications /> },
    ],
  },
];
export default MemberRoutes;
