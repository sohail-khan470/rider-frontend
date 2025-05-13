// routes/RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ type }: { type: string[] }) => {
  const userRole = localStorage.getItem("role");

  if (type.includes(userRole || "")) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" replace />;
  }
};

export default RoleRoute;
