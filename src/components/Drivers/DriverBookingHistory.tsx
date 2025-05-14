// src/components/Drivers/DriverBookingHistory.tsx
import React from "react";

interface Booking {
  id: number;
  requestedAt: string;
  pickup: string;
  dropoff: string;
  status: string;
}

interface DriverBookingHistoryProps {
  bookings: Booking[];
}

const DriverBookingHistory: React.FC<DriverBookingHistoryProps> = ({
  bookings,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-3">Booking History</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings available.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id} className="py-2">
              <div className="text-sm">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.requestedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Pickup:</strong> {booking.pickup}
                </p>
                <p>
                  <strong>Dropoff:</strong> {booking.dropoff}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverBookingHistory;
