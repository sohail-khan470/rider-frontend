import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useEffect } from "react";
import { useCompanyStore, useDriverStore, useCustomerStore } from "./stores";
import { RouterConfig } from "./routes/RouterConfig";

export default function App() {
  const { fetchAllCompanies } = useCompanyStore.getState();
  const { getAllDrivers } = useDriverStore.getState();
  const { getAllCustomers } = useCustomerStore.getState();

  useEffect(() => {
    fetchAllCompanies();
    getAllDrivers();
    getAllCustomers();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer position="top-right" />
      <RouterConfig />
    </Router>
  );
}
