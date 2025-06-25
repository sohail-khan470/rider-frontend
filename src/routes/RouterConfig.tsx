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
import PublicRoute from "./PublicRoute";
import DriverManagement from "../pages/DriverManagement/DriverManagement";
import CompanyManagementDashboard from "../pages/Company/CompanyManagement";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import LocationManagement from "../pages/LocationManagement/LocationManagement";
import CustomerManagement from "../pages/CustomerManagement/CustomerManagement";
import SchedulePage from "../pages/ScheduleManagement/SchedulePage";
import AdminManagement from "../pages/AdminManagement/AdminManagement";

export const RouterConfig = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
      </Route>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* SuperAdmin Routes */}
        <Route element={<RoleRoute type={["super_admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/company-management"
              element={<CompanyManagementDashboard />}
            />
            <Route path="/admin-management" element={<AdminManagement />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/alerts" element={<Alerts />} />
          </Route>
        </Route>

        {/* Company Admin Routes */}
        <Route element={<RoleRoute type={["ADMIN", "MANAGER", "OPERATOR"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/company/home" element={<CompanyDashboard />} />
            <Route path="/company/profile" element={<UserProfiles />} />
            <Route path="/company/bookings" element={<BookingManagement />} />
            <Route path="/company/staff" element={<StaffManagement />} />
            <Route path="/company/settings" element={<CompanySettings />} />
            <Route path="/locations" element={<LocationManagement />} />
            <Route path="/company/customers" element={<CustomerManagement />} />

            <Route
              path="/company/notifications"
              element={<NotificationsPage />}
            />
            <Route path="/company/schedules" element={<SchedulePage />} />
          </Route>
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute type={["ADMIN", "MANAGER", "OPERATOR"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/company/drivers" element={<DriverManagement />} />
            <Route
              path="/company/notifications"
              element={<NotificationsPage />}
            />
            <Route path="/locations" element={<LocationManagement />} />
          </Route>
        </Route>
      </Route>
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
