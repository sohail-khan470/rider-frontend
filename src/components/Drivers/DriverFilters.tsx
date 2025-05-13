// src/components/drivers/DriverFilters.tsx
import { useState } from "react";

interface DriverFiltersProps {
  onFilterChange: (filters: any) => void;
}

const DriverFilters = ({ onFilterChange }: DriverFiltersProps) => {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: "",
    companyId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );

    // Convert companyId to number if present
    if (cleanFilters.companyId) {
      cleanFilters.companyId = parseInt(cleanFilters.companyId);
    }

    onFilterChange(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      name: "",
      email: "",
      status: "",
      companyId: "",
    });
    onFilterChange({});
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">Filter Drivers</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2 text-sm">Driver Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleChange}
              className="w-full rounded border border-stroke py-2 px-3 focus:border-primary focus-visible:outline-none"
              placeholder="Search by name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="text"
              name="email"
              value={filters.email}
              onChange={handleChange}
              className="w-full rounded border border-stroke py-2 px-3 focus:border-primary focus-visible:outline-none"
              placeholder="Search by email"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full rounded border border-stroke py-2 px-3 focus:border-primary focus-visible:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="on_trip">On Trip</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Company ID</label>
            <input
              type="text"
              name="companyId"
              value={filters.companyId}
              onChange={handleChange}
              className="w-full rounded border border-stroke py-2 px-3 focus:border-primary focus-visible:outline-none"
              placeholder="Filter by company"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center border border-stroke py-2 px-4 mr-2 rounded-md text-black hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-primary py-2 px-4 text-white rounded-md hover:bg-opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverFilters;
