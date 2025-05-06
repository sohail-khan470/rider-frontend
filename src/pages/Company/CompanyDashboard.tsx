import PageMeta from "../../components/common/PageMeta";
import { Outlet } from "react-router";

const DashboardCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
    <h4 className="text-base font-semibold text-gray-700 dark:text-white">
      {title}
    </h4>
    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
      {value}
    </p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-700">
    <span className="text-gray-600 dark:text-gray-400 font-medium">
      {label}
    </span>
    <span className="text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default function CompanyDashboard() {
  const totalDrivers = 45;
  const totalCars = 20;
  const admin = {
    name: "John Doe",
    email: "admin@example.com",
    role: "Company Admin",
  };
  const company = {
    name: "FastRide Pvt Ltd",
    address: "123 Street, City, Country",
    contact: "+1 123-456-7890",
    description:
      "FastRide is a premium ride-sharing company providing safe and reliable transportation services.",
    logoUrl: "/images/company-logo.png", // optional
  };

  return (
    <>
      <PageMeta
        title="Company Dashboard | TailAdmin"
        description="Dashboard view showing company overview, drivers, cars and admin info"
      />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 flex flex-col sm:flex-row items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {company.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {company.address}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {company.contact}
          </p>
        </div>
        {company.logoUrl && (
          <img
            src={company.logoUrl}
            alt="Company Logo"
            className="w-20 h-20 rounded-full object-cover mt-4 sm:mt-0"
          />
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <DashboardCard title="Total Drivers" value={totalDrivers} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <DashboardCard title="Total Cars" value={totalCars} />
        </div>
      </div>

      {/* Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Admin Details
        </h2>
        <DetailRow label="Name" value={admin.name} />
        <DetailRow label="Email" value={admin.email} />
        <DetailRow label="Role" value={admin.role} />

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
          Company Details
        </h2>
        <DetailRow label="Company Name" value={company.name} />
        <DetailRow label="Address" value={company.address} />
        <DetailRow label="Contact" value={company.contact} />
        <DetailRow label="Description" value={company.description} />
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
}
