// routes/RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const userRole = localStorage.getItem("role");

  if (allowedRoles.includes(userRole || "")) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" replace />;
  }
};

export default RoleRoute;
