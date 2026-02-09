import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

/* ---------------------- Lazy Pages ---------------------- */

const LoginPage = lazy(() => import("@/features/auth/Login.page"));

/* ------------------------ Routes ------------------------ */

const AuthRoutes: RouteObject[] = [
  {
    path: "/signin",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
];

export default AuthRoutes;
