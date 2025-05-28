import { useState } from "react";
import { StaffForm } from "../staff/StaffForm";
import { useStaffStore } from "../../stores";
import { StaffFormValues } from "../staff/types";

export function AddStaffModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addStaff } = useStaffStore();

  const handleSubmit = async (data: StaffFormValues) => {
    setIsSubmitting(true);
    try {
      await addStaff({
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        companyId: data.companyId,
        password: data.password,
      });
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
      >
        Add New Staff
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 dark:bg-gray-900 dark:bg-opacity-50">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl max-w-md w-full p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white/90">
              Add New Staff Member
            </h2>
            <StaffForm
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </>
  );
}
