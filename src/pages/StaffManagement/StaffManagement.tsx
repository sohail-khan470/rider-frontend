import { useEffect } from "react";
import StaffList from "../../components/staff/StaffList";
import { AddStaffModal } from "../../components/modals/AddStaffModal";
import { useStaffStore } from "../../stores";

export default function StaffPage() {
  const { fetchStaff } = useStaffStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Staff Management
        </h1>
        <AddStaffModal />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <StaffList />
      </div>
    </div>
  );
}
