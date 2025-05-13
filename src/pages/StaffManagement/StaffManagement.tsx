import { useEffect } from "react";
import StaffList from "../../components/staff/StaffList";
import { AddStaffModal } from "../../components/modals/AddStaffModal";
import { useStaffStore } from "../../stores";

export default function StaffPage() {
  const { staff, fetchStaff } = useStaffStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <AddStaffModal />
      </div>
      <StaffList />
    </div>
  );
}
