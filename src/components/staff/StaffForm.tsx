import { useState } from "react";
import RoleSelector from "./RoleSelector";
// import RoleSelector from "./RoleSelector";

export default function AddUpdateStaffForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("dispatcher");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for adding/updating staff goes here (e.g., API call)
    alert(`Staff Added: ${name}, Role: ${role}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Add/Update Staff
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <RoleSelector currentRole={role} onChange={setRole} />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Staff
      </button>
    </form>
  );
}
