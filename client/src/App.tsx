import { useRoutes } from "react-router-dom";
import AdminRoutes from "@/routes/admin.routes";
import PublicRoutes from "@/routes/public.routes";
import AuthRoutes from "@/routes/auth.routes";
import NotFound from "@/features/NotFound/NotFound";
import MemberRoutes from "./routes/members.routes";
import StaffRoutes from "./routes/staff.routes";

const AppRoutes = () => {
  return useRoutes([
    ...AuthRoutes,
    ...AdminRoutes,
    ...MemberRoutes,
    ...StaffRoutes,
    ...PublicRoutes,
    // 404 - not found
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

function App() {
  return <AppRoutes />;
}

export default App;
