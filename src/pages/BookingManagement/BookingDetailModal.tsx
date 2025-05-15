import React from "react";
import { Booking } from "../../stores/types/booking.types";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen || !booking) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Booking Details #{booking.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="mt-1">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Booking Time
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(booking.requestedAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Pickup Location
              </h4>
              <p className="mt-1 text-sm text-gray-900">{booking.pickup}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Dropoff Location
              </h4>
              <p className="mt-1 text-sm text-gray-900">{booking.dropoff}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Customer</h4>
              <p className="mt-1 text-sm text-gray-900">
                {booking.customer?.name || `Customer ID: ${booking.customerId}`}
              </p>
              {booking.customer?.phone && (
                <p className="text-sm text-gray-500">
                  {booking.customer.phone}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Driver</h4>
              {booking.driverId ? (
                <div className="mt-1">
                  <p className="text-sm text-gray-900">
                    {booking.driver?.name || `Driver ID: ${booking.driverId}`}
                  </p>
                  {booking.driver?.phone && (
                    <p className="text-sm text-gray-500">
                      {booking.driver.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-500 italic">
                  No driver assigned
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Fare</h4>
            <p className="mt-1 text-sm text-gray-900">
              {booking.fare ? `$${booking.fare.toFixed(2)}` : "Not specified"}
            </p>
          </div>

          {booking.status === "ongoing" && (
            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Trip In Progress
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This trip is currently in progress. You can track the
                      driver's location in the Driver Locations section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-gray-50 flex justify-end rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
