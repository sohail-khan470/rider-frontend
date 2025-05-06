import CompanyDashboard from "./Company/CompanyDashboard";
import Home from "./Dashboard/Home";
import { Navigate } from "react-router-dom";

const Redirect = () => {
  const role = localStorage.getItem("role");

  switch (role) {
    case "superAdmin":
      return <Home />;
    case "companyAdmin":
      return <CompanyDashboard />;
    default:
      return <Navigate to="/signin" replace />;
  }
};

export default Redirect;
