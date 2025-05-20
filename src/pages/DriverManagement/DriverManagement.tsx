// src/pages/DriverManagement.tsx
import React, { useEffect, useState } from "react";
import { Driver, DriverStatus } from "./types/driver.types";
import { format } from "date-fns";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useDriverStore } from "../../stores";
import DriverFormModal from "./DriverFormModal";
import AvailabilityModal from "./AvaliblityModal";
const DriverManagement: React.FC = () => {
  const {
    drivers,
    currentDriver,
    loading,
    error,
    fetchDrivers,
    fetchDriverById,
    updateDriverStatus,
    deleteDriver,
    setCurrentDriver,
  } = useDriverStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  // console.log(currentDriver);

  useEffect(() => {
    fetchDrivers();
  }, [drivers]);

  const handleViewDriver = (id: number) => {
    fetchDriverById(id);
    setIsModalOpen(true);
  };

  const handleCreateDriver = () => {
    setCurrentDriver(null);
    setIsCreateModalOpen(true);
  };

  const handleManageAvailability = (id: number) => {
    fetchDriverById(id);
    setIsAvailabilityModalOpen(true);
  };

  const handleUpdateStatus = async (id: number, status: DriverStatus) => {
    try {
      await updateDriverStatus(id, status);
      // Remove fetchDrivers() call here
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleDeleteDriver = (id: number) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      deleteDriver(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false);
  };

  const getStatusBadgeClass = (status: DriverStatus) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      case "on_trip":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && drivers.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Driver Management</h1>
        <button
          onClick={handleCreateDriver}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Driver
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {driver.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        driver.status
                      )}`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.city?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver._count?.bookings || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button
                      onClick={() => handleViewDriver(driver.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleManageAvailability(driver.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Availability
                    </button>
                    <div className="inline-block">
                      <select
                        value={driver.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            driver.id,
                            e.target.value as DriverStatus
                          )
                        }
                        className="mt-1 block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="on_trip">On Trip</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Details Modal */}
      {isModalOpen && currentDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Driver Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{currentDriver.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentDriver.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{currentDriver.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      currentDriver.status
                    )}`}
                  >
                    {currentDriver.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicle Info</p>
                <p className="font-medium">{currentDriver.vehicleInfo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{currentDriver.city?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{currentDriver.company?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timezone</p>
                <p className="font-medium">{currentDriver.timezone || "UTC"}</p>
              </div>
              {currentDriver.location && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Latitude</p>
                    <p className="font-medium">{currentDriver.location.lat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Longitude</p>
                    <p className="font-medium">{currentDriver.location.lng}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {currentDriver.createdAt
                    ? format(new Date(currentDriver.createdAt), "PPpp")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="font-medium">
                  {currentDriver.updatedAt
                    ? format(new Date(currentDriver.updatedAt), "PPpp")
                    : "N/A"}
                </p>
              </div>
            </div>

            {currentDriver.bookings && currentDriver.bookings.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Recent Bookings</h3>
                <div className="bg-white shadow overflow-hidden rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {currentDriver.bookings.slice(0, 5).map((booking: any) => (
                      <li key={booking.id} className="px-4 py-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {booking.pickup} → {booking.dropoff}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(booking.requestedAt), "PPpp")}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : booking.status === "ongoing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Driver Modal */}
      {isCreateModalOpen && (
        <DriverFormModal driver={currentDriver} onClose={closeCreateModal} />
      )}

      {/* Availability Modal */}
      {isAvailabilityModalOpen && currentDriver && (
        <AvailabilityModal
          driver={currentDriver}
          onClose={closeAvailabilityModal}
        />
      )}
    </div>
  );
};

export default DriverManagement;
