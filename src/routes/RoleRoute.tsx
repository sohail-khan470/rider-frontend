// routes/RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ type }: { type: string[] }) => {
  const userType = localStorage.getItem("type");

  if (type.includes(userType || "")) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" replace />;
  }
};

export default RoleRoute;
