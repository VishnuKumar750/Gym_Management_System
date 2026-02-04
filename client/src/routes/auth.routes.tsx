import type { RouteObject } from "react-router-dom";

// page
import LoginPage from "@/features/auth/pages/Login.page";

const AuthRoutes: RouteObject[] = [
  {
    path: "/signin",
    element: <LoginPage />,
  },
];

export default AuthRoutes;
