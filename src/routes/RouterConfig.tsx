import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import NotFound from "../pages/OtherPage/NotFound";
import UserProfiles from "../pages/UserProfiles";
import Alerts from "../pages/UiElements/Alerts";
import Calendar from "../pages/Calendar";
import FormElements from "../pages/Forms/FormElements";
import AppLayout from "../layout/AppLayout";
import Home from "../pages/Dashboard/Home";
import AuthLayout from "../layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import CompanyDashboard from "../pages/Company/CompanyDashboard";
import BookingManagement from "../pages/BookingManagement/BookingManagement";
import StaffManagement from "../pages/StaffManagement/StaffManagement";
import CompanySettings from "../pages/Company/CompanySettings";

export const RouterConfig = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* SuperAdmin Routes */}
        <Route element={<RoleRoute allowedRoles={["superAdmin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/alerts" element={<Alerts />} />
          </Route>
        </Route>

        {/* Company Admin Routes */}
        <Route element={<RoleRoute allowedRoles={["companyAdmin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/company/home" element={<CompanyDashboard />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/bookings" element={<BookingManagement />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/settings" element={<CompanySettings />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
