// src/components/drivers/DriverStats.tsx
import { useEffect, useState } from "react";
import { useDriverStore } from "../../stores";
const DriverStats = () => {
  const { drivers } = useDriverStore();
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    onTrip: 0,
  });

  useEffect(() => {
    if (drivers.length > 0) {
      setStats({
        total: drivers.length,
        online: drivers.filter((d) => d.status === "online").length,
        offline: drivers.filter((d) => d.status === "offline").length,
        onTrip: drivers.filter((d) => d.status === "on_trip").length,
      });
    }
  }, [drivers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold text-black">{stats.total}</h4>
            <p className="text-sm font-medium">Total Drivers</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19.25C15.5563 19.25 19.25 15.5563 19.25 11C19.25 6.44365 15.5563 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11C2.75 15.5563 6.44365 19.25 11 19.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 7.33301V11.8747L13.75 13.7497"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold text-black">{stats.online}</h4>
            <p className="text-sm font-medium">Online Drivers</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19.25C15.5563 19.25 19.25 15.5563 19.25 11C19.25 6.44365 15.5563 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11C2.75 15.5563 6.44365 19.25 11 19.25Z"
                stroke="#22C55E"
                strokeWidth="1.5"
              />
              <path
                d="M7.33301 11L9.99967 13.6667L14.6663 9"
                stroke="#22C55E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold text-black">{stats.onTrip}</h4>
            <p className="text-sm font-medium">On Trip</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19.25C15.5563 19.25 19.25 15.5563 19.25 11C19.25 6.44365 15.5563 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11C2.75 15.5563 6.44365 19.25 11 19.25Z"
                stroke="#3B82F6"
                strokeWidth="1.5"
              />
              <path
                d="M8.25 11H13.75"
                stroke="#3B82F6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 8.25V13.75"
                stroke="#3B82F6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold text-black">{stats.offline}</h4>
            <p className="text-sm font-medium">Offline Drivers</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19.25C15.5563 19.25 19.25 15.5563 19.25 11C19.25 6.44365 15.5563 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11C2.75 15.5563 6.44365 19.25 11 19.25Z"
                stroke="#64748B"
                strokeWidth="1.5"
              />
              <path
                d="M13.75 8.25L8.25 13.75"
                stroke="#64748B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 8.25L13.75 13.75"
                stroke="#64748B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverStats;
