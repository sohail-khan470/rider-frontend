interface RoleSelectorProps {
  currentRole: string;
  onChange: (role: string) => void;
}

export default function RoleSelector({
  currentRole,
  onChange,
}: RoleSelectorProps) {
  const roles = ["dispatcher", "support", "admin", "driver"];

  return (
    <div>
      <label
        htmlFor="role"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Role
      </label>
      <select
        id="role"
        value={currentRole}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:text-white"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
