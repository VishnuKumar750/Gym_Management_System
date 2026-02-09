import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

import AdminRoutes from "@/routes/admin.routes";
import PublicRoutes from "@/routes/public.routes";
import AuthRoutes from "@/routes/auth.routes";
import MemberRoutes from "@/routes/members.routes";
import StaffRoutes from "@/routes/staff.routes";

/* ---------------------- Lazy Pages ---------------------- */

const NotFound = lazy(() => import("@/features/NotFound/NotFound"));

/* ------------------------- Routes ----------------------- */

const AppRoutes = () =>
  useRoutes([
    ...AuthRoutes,
    ...AdminRoutes,
    ...MemberRoutes,
    ...StaffRoutes,
    ...PublicRoutes,
    {
      path: "*",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <NotFound />
        </Suspense>
      ),
    },
  ]);

export default function App() {
  return <AppRoutes />;
}
