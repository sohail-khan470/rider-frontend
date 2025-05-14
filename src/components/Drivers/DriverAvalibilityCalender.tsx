import React from "react";
import moment from "moment";

interface AvailabilitySlot {
  startTime: string; // ISO string
  endTime: string; // ISO string
  available: boolean;
}

interface DriverAvailabilityCalendarProps {
  availability: AvailabilitySlot[];
  driverId: number;
}

const DriverAvailabilityCalendar: React.FC<DriverAvailabilityCalendarProps> = ({
  availability,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-3">Availability Calendar</h3>
      <ul className="space-y-2">
        {availability.map((slot, index) => (
          <li key={index} className="text-sm flex justify-between">
            <span>
              {moment(slot.startTime).format("ddd, MMM D, YYYY")} (
              {moment(slot.startTime).format("hh:mm A")} -{" "}
              {moment(slot.endTime).format("hh:mm A")})
            </span>
            <span
              className={`font-semibold ${
                slot.available ? "text-green-600" : "text-red-600"
              }`}
            >
              {slot.available ? "Available" : "Unavailable"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverAvailabilityCalendar;
