import { Navigate } from "react-router-dom";
import { useAuth } from "./context/Auth";


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log('user', user)

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
