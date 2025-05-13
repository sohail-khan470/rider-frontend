// src/pages/DriverManagement/DriverList.tsx
import { useEffect, useState } from "react";
import { useDriverStore } from "../../store/driver.store";
import DriverTable from "../../components/drivers/DriverTable";
import DriverFilters from "../../components/drivers/DriverFilters";
import DriverStats from "../../components/drivers/DriverStats";
import Breadcrumb from "../../components/Breadcrumb";
import { Link } from "react-router-dom";

const DriverList = () => {
  const { drivers, pagination, loading, error, fetchDrivers } =
    useDriverStore();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchDrivers(filters, pagination.page, pagination.pageSize);
  }, [filters, pagination.page, pagination.pageSize]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchDrivers(filters, page, pagination.pageSize);
  };

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Driver Management" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Drivers</h2>
          <Link
            to="/drivers/create"
            className="inline-flex items-center justify-center bg-primary py-2 px-4 text-white rounded-md hover:bg-opacity-90"
          >
            <span className="mr-2">+</span> Add Driver
          </Link>
        </div>

        <DriverStats />

        <div className="rounded-sm border border-stroke bg-white shadow-default">
          <div className="p-4 md:p-6 xl:p-7.5">
            <DriverFilters onFilterChange={handleFilterChange} />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <DriverTable
              drivers={drivers}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverList;
