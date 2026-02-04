import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Role = "admin" | "staff" | "trainer" | "member";

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        Loading authentication...
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  // Logged in but role not allowed
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
