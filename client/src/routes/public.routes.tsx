import type { RouteObject } from "react-router-dom";

// page
import LandingLayout from "@/components/layout/landing.layout";
import LandingPage from "@/features/common/pages/Landing.pages";

const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
];

export default PublicRoutes;
