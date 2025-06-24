import { useEffect, useState } from "react";
import { useAuthStore, useCompanyStore } from "../../stores";
import { useNavigate } from "react-router-dom";

const AdminManagement = () => {
  const { registerAdmin } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const navigate = useNavigate();
  const roleId = 1;

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    password: "",
    roleId: roleId,
    companyId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
  });

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      companyId: "",
    };

    if (!admin.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!admin.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(admin.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!admin.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (admin.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!admin.companyId) {
      newErrors.companyId = "Company is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      registerAdmin(admin);
      // Reset form after submission
      setAdmin({
        name: "",
        email: "",
        password: "",
        roleId: roleId,
        companyId: "",
      });
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Register Admin
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={admin.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.name
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.email
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={admin.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.password
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="companyId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Company
          </label>
          <select
            id="companyId"
            name="companyId"
            value={admin.companyId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.companyId
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          {errors.companyId && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.companyId}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200"
        >
          Register Admin
        </button>
      </form>
    </div>
  );
};

export default AdminManagement;
