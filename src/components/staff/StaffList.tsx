import { useStaffStore } from "../../stores/staff.store";

// components/staff/StaffList.tsx
import { Staff } from "../../stores/types/staff.types";

interface StaffListProps {
  staff: Staff[] | any;
  onSelectStaff: (staff: Staff) => void;
}

export default function StaffList({ onSelectStaff }: StaffListProps) {
  const { staff } = useStaffStore();
  console.log("staff", staff);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Staff Members
      </h2>
      <div className="space-y-4">
        {staff.map((staffMember: any) => (
          <div
            key={staffMember.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => onSelectStaff(staffMember)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {staffMember.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {staffMember.email}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                {staffMember.roleId}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
