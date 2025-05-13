import { PencilIcon } from "@heroicons/react/24/outline";
import StaffFormModal from "./StaffFormModal";
import { useStaffStore } from "../../stores";
import { useState } from "react";
import { staffApi } from "../../api/endpoints/staffApi";
import { Staff, StaffFormValues } from "./types";
//import { useStaffStore } from "../stores/staffStore";

export default function StaffList() {
  const {
    staff,
    selectedStaff,
    selectStaff,
    clearSelectedStaff,
    fetchStaff,
    updateStaff,
  } = useStaffStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (staff: Staff) => {
    selectStaff(staff);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id: number, data: StaffFormValues) => {
    try {
      await staffApi.updateStaff(id, data);
      updateStaff(id, data);
      fetchStaff(); // Refresh the list
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staff.map((staffMember) => (
            <tr key={staffMember.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {staffMember.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {staffMember.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {staffMember.role.name.replace("_", " ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEdit(staffMember)}
                  className="text-indigo-600 hover:text-indigo-900"
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
