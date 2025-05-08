// components/StaffCard.tsx

import React, { useState } from "react";

type Role = "Admin" | "Dispatcher" | "Support";
interface Staff {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface StaffCardProps {
  staff: Staff;
  onUpdateRole: (id: number, role: Role) => void;
  onRemove: (id: number) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  onUpdateRole,
  onRemove,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(staff.role);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setSelectedRole(newRole);
    onUpdateRole(staff.id, newRole);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center mb-2">
      <div>
        <h3 className="font-semibold">{staff.name}</h3>
        <p>{staff.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="border rounded px-2 py-1"
        >
          <option value="Admin">Admin</option>
          <option value="Dispatcher">Dispatcher</option>
          <option value="Support">Support</option>
        </select>
        <button
          onClick={() => onRemove(staff.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
