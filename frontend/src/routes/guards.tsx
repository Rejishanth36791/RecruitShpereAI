import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export function RoleRoute({ allow, children }: { allow: string[]; children: ReactNode }) {
  const { role } = useAuth();

  if (!role || !allow.includes(role)) {
    return <Navigate to={homeForRole(role)} replace />;
  }
  return <>{children}</>;
}

export function homeForRole(role: string | undefined): string {
  switch (role) {
    case "Candidate":
      return "/candidate";
    case "Recruiter":
      return "/recruiter";
    case "HiringManager":
      return "/manager";
    case "Admin":
      return "/admin";
    default:
      return "/login";
  }
}
