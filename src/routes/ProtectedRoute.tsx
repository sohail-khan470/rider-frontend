import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("authToken");
  const type = localStorage.getItem("type");

  // If either token or role is missing, redirect to login
  if (!token || !type) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
}
