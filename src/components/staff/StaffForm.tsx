import { useEffect, useState } from "react";
import { StaffFormValues } from "./types";
import { useStaffStore, useRoleStore } from "../../stores";

interface StaffFormProps {
  onSubmit: (data: StaffFormValues) => Promise<void>;
  defaultValues?: Partial<StaffFormValues>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function StaffForm({
  onSubmit,
  defaultValues = {},
  onCancel,
  isSubmitting,
}: StaffFormProps) {
  const [formData, setFormData] = useState<StaffFormValues>({
    name: defaultValues.name || "",
    email: defaultValues.email || "",
    password: defaultValues.password || "",
    roleId: defaultValues.roleId || "",
    companyId: defaultValues.companyId || "", // Make sure this is provided via defaultValues
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof StaffFormValues, string>>
  >({});

  const { staff, fetchStaff } = useStaffStore();
  const { roles, fetchRoles } = useRoleStore();

  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, [fetchStaff, fetchRoles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Only validate password if it's not in defaultValues (edit mode)
    if (!defaultValues.password && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.roleId) newErrors.roleId = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Create submission data with roleId as number
      const submissionData = {
        ...formData,
        roleId: Number(formData.roleId), // Convert roleId to number
        // Omitting password if it's empty (for updates)
        ...(defaultValues.password === undefined && !formData.password
          ? { password: undefined }
          : {}),
      };
      await onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password {defaultValues.password && "(leave blank to keep current)"}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="roleId"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="roleId"
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.roleId ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {" "}
              {/* Use role.id instead of role.name */}
              {role.name}
            </option>
          ))}
        </select>
        {errors.roleId && (
          <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
        )}
      </div>

      {/* Hidden companyId field if it's not meant to be editable */}
      {formData.companyId && (
        <input type="hidden" name="companyId" value={formData.companyId} />
      )}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
