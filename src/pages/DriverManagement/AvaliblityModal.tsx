import React, { useState } from "react";
import { Driver } from "./types/driver.types";
import { format } from "date-fns";
import { useDriverStore } from "../../stores";

// AvailabilityModal component (inside the same file)
interface AvailabilityModalProps {
  driver: Driver;
  onClose: () => void;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  driver,
  onClose,
}) => {
  const { addDriverAvailability, removeDriverAvailability, loading } =
    useDriverStore();
  const [formData, setFormData] = useState({
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(addHours(new Date(), 8), "yyyy-MM-dd'T'HH:mm"),
  });

  function addHours(date: Date, hours: number) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDriverAvailability({
        driverId: driver.id,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setFormData({
        startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(addHours(new Date(), 8), "yyyy-MM-dd'T'HH:mm"),
      });
    } catch (error) {
      console.error("Error adding availability:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this availability?")) {
      await removeDriverAvailability(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Driver Availability</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Add New Availability</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="startTime"
                >
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="endTime"
                >
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Availability"}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Current Availability</h3>
          {driver.availability && driver.availability.length > 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-md">
              <ul className="divide-y divide-gray-200">
                {driver.availability.map((slot: any) => (
                  <li
                    key={slot.id}
                    className="px-4 py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(slot.startTime), "PPpp")}
                      </p>
                      <p className="text-xs text-gray-500">
                        to {format(new Date(slot.endTime), "PPpp")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">No availability periods set.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
