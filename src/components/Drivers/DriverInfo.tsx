// src/components/drivers/DriverInfo.tsx
import { Driver } from "../../store/types/driver.types";
import DriverStatusBadge from "./DriverStatusBadge";

interface DriverInfoProps {
  driver: Driver;
}

const DriverInfo = ({ driver }: DriverInfoProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default p-4 md:p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Driver Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Name</p>
          <p className="font-medium">{driver.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <DriverStatusBadge status={driver.status} />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <p className="font-medium">{driver.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Phone</p>
          <p className="font-medium">{driver.phone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Vehicle Information</p>
          <p className="font-medium">{driver.vehicleInfo}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Company</p>
          <p className="font-medium">{driver.company?.name || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Created At</p>
          <p className="font-medium">
            {new Date(driver.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Last Updated</p>
          <p className="font-medium">
            {new Date(driver.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
