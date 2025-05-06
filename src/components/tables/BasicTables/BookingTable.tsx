import { useState } from "react";
import DispatchDriverModal from "../../modals/DispatchDriverModal";

// Define a type for the booking
type Booking = {
  id: string;
  customer: string;
  pickup: string;
  drop: string;
  status: string;
  assignedDriver: string | null;
};

const bookings: Booking[] = [
  {
    id: "B001",
    customer: "Alice",
    pickup: "Location A",
    drop: "Location B",
    status: "Upcoming",
    assignedDriver: null,
  },
  {
    id: "B002",
    customer: "Bob",
    pickup: "Location C",
    drop: "Location D",
    status: "Completed",
    assignedDriver: "John",
  },
];

export default function BookingTable() {
  // Update the useState to properly handle both null and a Booking object
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Booking ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Pickup</th>
              <th className="px-4 py-2">Drop</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Driver</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{booking.id}</td>
                <td className="px-4 py-2">{booking.customer}</td>
                <td className="px-4 py-2">{booking.pickup}</td>
                <td className="px-4 py-2">{booking.drop}</td>
                <td className="px-4 py-2">{booking.status}</td>
                <td className="px-4 py-2">
                  {booking.assignedDriver || (
                    <span className="text-gray-500">Not Assigned</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {booking.status === "Upcoming" && (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Dispatch Driver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <DispatchDriverModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}
