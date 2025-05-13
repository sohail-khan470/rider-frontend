import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role");

  if (authToken && userRole === "super_admin") {
    return <Navigate to="/" replace />;
  }

  if (authToken && userRole === "admin") {
    return <Navigate to="/company/home" replace />;
  }

  return children;
};

export default PublicRoute;
