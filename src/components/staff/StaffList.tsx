import { useState } from "react";
import RoleSelector from "./RoleSelector";

// types.ts
export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

const staffMembers: Staff[] = [
  {
    id: "S001",
    name: "John Doe",
    email: "john@example.com",
    role: "dispatcher",
  },
  {
    id: "S002",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "support",
  },
];

export default function StaffList() {
  const [staff, setStaff] = useState(staffMembers);

  const updateRole = (id: string, newRole: string) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, role: newRole } : member
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Staff Members
      </h2>
      <ul className="space-y-3">
        {staff.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
          >
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {member.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {member.email}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <RoleSelector
                currentRole={member.role}
                onChange={(newRole) => updateRole(member.id, newRole)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
