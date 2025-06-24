import { useEffect } from "react";
import StaffList from "../../components/staff/StaffList";
import { AddStaffModal } from "../../components/modals/AddStaffModal";
import { useStaffStore } from "../../stores";
import { useAuthStore } from "../../stores";

export default function StaffPage() {
  const { fetchStaff } = useStaffStore();
  const { user } = useAuthStore();

  const ADMIN_ACCESS = user?.permissions.includes("ADMIN_ACCESS");

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Staff Management
        </h1>

        {ADMIN_ACCESS && <AddStaffModal />}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <StaffList adminAccess={ADMIN_ACCESS} />
      </div>
    </div>
  );
}
