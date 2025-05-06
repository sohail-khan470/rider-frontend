import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  if (authToken && role === "superAdmin") {
    return <Navigate to="/" replace />;
  }

  if (authToken && role === "companyAdmin") {
    return <Navigate to="/company/home" replace />;
  }

  return children;
};

export default PublicRoute;
