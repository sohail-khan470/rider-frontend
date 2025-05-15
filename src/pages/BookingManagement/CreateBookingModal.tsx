import React, { useState } from "react";
import { useBookingStore } from "../../stores";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createBooking, loading } = useBookingStore();
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    fare: "",
  });
  const [errors, setErrors] = useState({
    pickup: "",
    dropoff: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { pickup: "", dropoff: "" };

    if (!formData.pickup.trim()) {
      newErrors.pickup = "Pickup location is required";
      valid = false;
    }

    if (!formData.dropoff.trim()) {
      newErrors.dropoff = "Dropoff location is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bookingData = {
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      fare: formData.fare ? parseFloat(formData.fare) : undefined,
    };

    await createBooking(bookingData);
    onClose();
    setFormData({ pickup: "", dropoff: "", fare: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Booking
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                placeholder="Enter pickup address"
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  errors.pickup ? "border-red-500" : ""
                }`}
              />
              {errors.pickup && (
                <p className="text-red-500 text-xs mt-1">{errors.pickup}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dropoff Location
              </label>
              <input
                type="text"
                name="dropoff"
                value={formData.dropoff}
                onChange={handleChange}
                placeholder="Enter destination address"
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  errors.dropoff ? "border-red-500" : ""
                }`}
              />
              {errors.dropoff && (
                <p className="text-red-500 text-xs mt-1">{errors.dropoff}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fare (Optional)
              </label>
              <input
                type="number"
                name="fare"
                value={formData.fare}
                onChange={handleChange}
                placeholder="Enter fare amount"
                step="0.01"
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 flex justify-end rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;
