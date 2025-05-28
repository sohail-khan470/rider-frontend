import { PencilIcon } from "@heroicons/react/24/outline";
import StaffFormModal from "./StaffFormModal";
import { useStaffStore } from "../../stores";
import { useState } from "react";
import { staffApi } from "../../api/endpoints/staffApi";
import { Staff, StaffFormValues } from "./types";

export default function StaffList() {
  const { staff, selectedStaff, selectStaff, clearSelectedStaff } =
    useStaffStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (staff: Staff) => {
    selectStaff(staff);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id: number, data: StaffFormValues) => {
    try {
      await staffApi.updateStaff(id, data);
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {staff.map((staffMember) => (
            <tr
              key={staffMember.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {staffMember.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {staffMember.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                {staffMember.role.name.replace("_", " ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEdit(staffMember)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          clearSelectedStaff();
        }}
        staff={selectedStaff}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
