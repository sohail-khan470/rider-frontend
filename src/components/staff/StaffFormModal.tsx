import { useEffect, useState } from "react";
import { Staff, StaffFormValues } from "./types";
import { useRoleStore } from "../../stores";

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onSubmit: (id: number, data: StaffFormValues) => Promise<void>;
}

export default function StaffFormModal({
  isOpen,
  onClose,
  staff,
  onSubmit,
}: StaffFormModalProps) {
  const [formData, setFormData] = useState<StaffFormValues>({
    name: "",
    email: "",
    roleId: 0,
    password: "",
  });

  const { roles, fetchRoles } = useRoleStore();

  const [errors, setErrors] = useState<
    Partial<Record<keyof StaffFormValues, string>>
  >({});
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    fetchRoles();
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        roleId: staff.role.id,
        password: "",
      });
    }
  }, [staff]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "roleId" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.roleId) newErrors.roleId = "Role is required";

    // Only validate password if the field is shown and not empty
    if (showPasswordField && formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff || !validate()) return;

    // Prepare data to submit - exclude password if not provided
    const submitData = {
      name: formData.name,
      email: formData.email,
      roleId: formData.roleId,
      ...(showPasswordField &&
        formData.password && { password: formData.password }),
    };

    try {
      await onSubmit(staff.id, submitData);
      onClose();
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Edit Staff Member
          </h2>

          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="roleId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.roleId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
              )}
            </div>

            {!showPasswordField ? (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordField(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password (optional)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Leave empty to keep current password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordField(false);
                    setFormData((prev) => ({ ...prev, password: "" }));
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-500"
                >
                  Cancel password change
                </button>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
