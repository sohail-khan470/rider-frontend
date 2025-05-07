import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = localStorage.getItem("authToken");
  const type = localStorage.getItem("type");

  if (authToken && type === "super_admin") {
    return <Navigate to="/" replace />;
  }

  if (authToken && type === "user") {
    return <Navigate to="/company/home" replace />;
  }

  return children;
};

export default PublicRoute;
