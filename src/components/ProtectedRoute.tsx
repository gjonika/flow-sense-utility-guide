// src/components/ProtectedRoute.tsx
import { useLocation, Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const code = new URLSearchParams(location.search).get("code");

  if (code !== "letmein123") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
