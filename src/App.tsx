import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useEffect } from "react";
import {
  useCompanyStore,
  useDriverStore,
  useCustomerStore,
  useAuthStore,
} from "./stores";
import { RouterConfig } from "./routes/RouterConfig";

export default function App() {
  const { fetchAllCompanies, getCompanyByAdminId, currentCompany, loading } =
    useCompanyStore.getState();
  const { getAllDrivers } = useDriverStore.getState();
  const { getAllCustomers } = useCustomerStore.getState();
  const { initializeAuth, user } = useAuthStore();

  useEffect(() => {
    fetchAllCompanies();
    getAllDrivers();
    getAllCustomers();
    initializeAuth();
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    let id = localStorage.getItem("userId") as any;
    id = parseInt(id);
    if (role === "companyAdmin" && id) {
      getCompanyByAdminId(id);
    }
  }, [currentCompany]);

  // if (loading) {
  //   return <p>loading......</p>;
  // }

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer position="top-right" />
      <RouterConfig />
    </Router>
  );
}
