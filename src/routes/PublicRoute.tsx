import { Navigate } from "react-router";
import { useAuthStore } from "../stores";
Navigate;
// Create a new PublicRoute component to handle redirects for authenticated users
const PublicRoute = ({ children }) => {
  const { token, role } = useAuthStore();

  if (token) {
    // Redirect based on role
    if (role === "superAdmin") {
      return <Navigate to="/" replace />;
    } else if (role === "companyAdmin") {
      return <Navigate to="/company/home" replace />;
    } else {
      return <Navigate to="/" replace />; // fallback
    }
  }

  return children;
};

export default PublicRoute;
