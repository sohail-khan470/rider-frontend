import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role");

  // If either token or role is missing, redirect to login
  if (!token || !userRole) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
}
