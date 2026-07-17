import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { homeForRole } from "@/routes/guards";

export function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  return <Navigate to={isAuthenticated ? homeForRole(role) : "/login"} replace />;
}
