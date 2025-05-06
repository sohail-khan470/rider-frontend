import PageMeta from "../../components/common/PageMeta";
import AddUpdateStaffForm from "../../components/staff/StaffForm";
import StaffList from "../../components/staff/StaffList";

export default function StaffManagement() {
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

        <AddUpdateStaffForm />
        <StaffList />
      </div>
    </>
  );
}
