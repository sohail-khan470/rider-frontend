import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDriverStore } from "../../stores";
import { useCityStore } from "../../stores/city.store";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const EditScheduleModal = ({ schedule, onClose, onSubmit, loading }: any) => {
  const { drivers, fetchDrivers } = useDriverStore();
  const { cities, fetchCities } = useCityStore();

  useEffect(() => {
    fetchDrivers();
    fetchCities();
  }, []);

  // Get company ID from token
  const token = localStorage.getItem("authToken") as any;
  const decoded = jwtDecode(token) as any;
  const companyId = decoded.companyId;

  // Format dates using moment for initial state
  const formatDateForInput = (dateString: string) => {
    return dateString ? moment(dateString).format("YYYY-MM-DDTHH:mm") : "";
  };

  const [formData, setFormData] = useState({
    driverId: schedule.driverId.toString(),
    fromCityId: schedule.fromCityId.toString(),
    toCityId: schedule.toCityId.toString(),
    departure: formatDateForInput(schedule.departure),
    estimatedArrival: formatDateForInput(schedule.estimatedArrival),
    returnTime: formatDateForInput(schedule.returnTime),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format dates using Moment.js consistently with CreateScheduleModal
      const formatDateForAPI = (dateString: string) => {
        if (!dateString) return undefined;
        return moment(dateString).format("YYYY-MM-DDTHH:mm:ssZ");
      };

      await onSubmit({
        ...formData,
        driverId: parseInt(formData.driverId),
        fromCityId: parseInt(formData.fromCityId),
        toCityId: parseInt(formData.toCityId),
        departure: formatDateForAPI(formData.departure),
        estimatedArrival: formatDateForAPI(formData.estimatedArrival),
        returnTime: formData.returnTime
          ? formatDateForAPI(formData.returnTime)
          : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  // Filter drivers that belong to the current company
  const companyDrivers = drivers.filter(
    (driver) => driver.companyId === companyId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Schedule #{schedule.id}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Driver
              </label>
              <select
                required
                value={formData.driverId}
                onChange={(e) =>
                  setFormData({ ...formData, driverId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a driver</option>
                {companyDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From City
              </label>
              <select
                required
                value={formData.fromCityId}
                onChange={(e) =>
                  setFormData({ ...formData, fromCityId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To City
              </label>
              <select
                required
                value={formData.toCityId}
                onChange={(e) =>
                  setFormData({ ...formData, toCityId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select destination city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Departure Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.departure}
                onChange={(e) =>
                  setFormData({ ...formData, departure: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Arrival
              </label>
              <input
                type="datetime-local"
                required
                value={formData.estimatedArrival}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedArrival: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Return Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.returnTime}
                onChange={(e) =>
                  setFormData({ ...formData, returnTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Schedule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditScheduleModal;
