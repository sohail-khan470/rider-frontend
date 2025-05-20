import React, { useEffect, useState } from "react";
import { Driver, DriverStatus } from "./types/driver.types";
import { useDriverStore } from "../../stores";
import { jwtDecode } from "jwt-decode";
import { useCityStore } from "../../stores/city.store";

interface DriverFormModalProps {
  driver: Driver | null;
  onClose: () => void;
}

const DriverFormModal: React.FC<DriverFormModalProps> = ({
  driver,
  onClose,
}) => {
  const {
    drivers,
    createDriver,
    updateDriver,
    loading,
    fetchDrivers,
    updateDriverStatus,
  } = useDriverStore();
  const { cities, fetchCities, loading: citiesLoading } = useCityStore();

  const [formData, setFormData] = useState({
    name: driver?.name || "",
    email: driver?.email || "",
    phone: driver?.phone || "",
    vehicleInfo: driver?.vehicleInfo || "",
    cityId: driver?.cityId || 0,
    status: driver?.status || ("offline" as DriverStatus),
    timezone: driver?.timezone || "",
  });

  useEffect(() => {
    // Fetch cities from the city store
    fetchDrivers();
    fetchCities();
  }, []);

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: name === "cityId" ? Number(value) : value,
  //   });
  //   fetchDrivers();
  // };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Update local form state
    setFormData({
      ...formData,
      [name]: name === "cityId" ? Number(value) : value,
    });

    // If changing status and we have a driver, update in the store
    if (name === "status" && driver) {
      try {
        await updateDriverStatus(driver.id, value as DriverStatus);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get companyId from JWT
    const token = localStorage.getItem("authToken") || "";
    const decoded = jwtDecode(token) as any;
    const companyId = decoded.companyId;

    const driverData = {
      ...formData,
      companyId: companyId,
      cityId: Number(formData.cityId),
    };

    try {
      if (driver) {
        await updateDriver(driver.id, driverData);
        fetchDrivers();
      } else {
        await createDriver(driverData as any);
        await fetchDrivers();
      }
      onClose();
    } catch (error) {
      console.error("Error saving driver:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {driver ? "Edit Driver" : "Add New Driver"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="vehicleInfo"
            >
              Vehicle Information
            </label>
            <textarea
              id="vehicleInfo"
              name="vehicleInfo"
              value={formData.vehicleInfo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="cityId"
            >
              City
            </label>
            {citiesLoading ? (
              <select
                disabled
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option>Loading cities...</option>
              </select>
            ) : (
              <select
                id="cityId"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="on_trip">On Trip</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="timezone"
            >
              Timezone
            </label>
            <input
              id="timezone"
              name="timezone"
              type="text"
              value={formData.timezone}
              onChange={handleChange}
              placeholder="e.g. UTC+0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading || citiesLoading}
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <span>{driver ? "Update" : "Create"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverFormModal;
