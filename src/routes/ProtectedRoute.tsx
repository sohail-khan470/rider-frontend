import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // If either token or role is missing, redirect to login
  if (!token || !role) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
}
