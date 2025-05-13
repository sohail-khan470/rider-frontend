import { useState } from "react";

export default function CompanyProfileForm() {
  const [company, setCompany] = useState({
    name: "Bluell Inc.",
    email: "info@bluell.com",
    phone: "+1 123 456 7890",
    address: "123 Main St, New York, USA",
    logo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files?.[0]) {
      setCompany((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setCompany((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send `company` data to backend via API

    alert("Company profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["name", "email", "phone", "address"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {field}
          </label>
          <input
            type="text"
            name={field}
            value={(company as any)[field]}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Logo
        </label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block"
        />
        {company.logo && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Selected: {company.logo.name}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
}
