// pages/staff-management.tsx
import { useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import AddStaffForm from "../../components/staff/StaffForm";
import StaffList from "../../components/staff/StaffList";
import { useStaffStore } from "../../stores/staff.store";

export default function StaffManagement() {
  const { fetchStaff, staff } = useStaffStore();

  console.log(staff);

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <>
      <PageMeta
        title="Role & Staff Management | Company Dashboard"
        description="Manage company staff, assign roles like dispatcher, support, and more."
      />

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Role & Staff Management
        </h1>

        <AddStaffForm />
        <StaffList />
      </div>
    </>
  );
}
