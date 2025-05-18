// src/components/ProtectedRoute.tsx
import { useLocation, Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const accessCode = new URLSearchParams(location.search).get("code");

  if (accessCode !== "letmein123") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
