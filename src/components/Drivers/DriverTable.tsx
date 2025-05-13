// src/components/drivers/DriverTable.tsx
import { Link } from "react-router-dom";
import { Driver } from "../../store/types/driver.types";
import DriverStatusBadge from "./DriverStatusBadge";

interface DriverTableProps {
  drivers: Driver[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
}

const DriverTable = ({
  drivers,
  loading,
  pagination,
  onPageChange,
}: DriverTableProps) => {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No drivers found
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-200">
                  <td className="p-3">{driver.name}</td>
                  <td className="p-3">{driver.company?.name || "-"}</td>
                  <td className="p-3">{driver.email}</td>
                  <td className="p-3">{driver.phone}</td>
                  <td className="p-3">
                    <DriverStatusBadge status={driver.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/drivers/${driver.id}`}
                        className="text-primary hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        to={`/drivers/edit/${driver.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {pagination.page} of {totalPages} pages ({pagination.total}{" "}
            drivers)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded ${
                pagination.page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className={`px-3 py-1 rounded ${
                pagination.page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverTable;
