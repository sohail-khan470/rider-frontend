import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDriverStore } from "../../stores";
import DriverTable from "../../components/Drivers/DriverTable";
import DriverFilters from "../../components/Drivers/DriverFilters";
import DriverStats from "../../components/Drivers/DriverStats";
import Breadcrumb from "../../components/Drivers/BreadCrumb";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const DriverList = () => {
  const { drivers, loading, error, fetchDrivers } = useDriverStore() as any;

  const [filters, setFilters] = useState<Record<string, any>>({});

  console.log(filters, "FFFFFFFFFFF");

  // Memoized filter handler
  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Memoized page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchDrivers(filters);
    },
    [filters, fetchDrivers]
  );

  // Optimized data fetching
  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        await fetchDrivers(filters);
      } catch (err) {
        if (isMounted && !abortController.signal.aborted) {
          console.error("Fetch error:", err);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [filters, fetchDrivers]);

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Driver Management" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Drivers</h2>
          <Link
            to="/drivers/create"
            className="inline-flex items-center justify-center bg-primary py-2 px-4 text-white rounded-md hover:bg-opacity-90 transition-colors"
            aria-label="Add new driver"
          >
            <span className="mr-2">+</span> Add Driver
          </Link>
        </div>

        <DriverStats />

        <div className="rounded-sm border border-stroke bg-white shadow-default">
          <div className="p-4 md:p-6 xl:p-7.5">
            <DriverFilters
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              loading={loading} // Pass the loading state
            />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.message || String(error)}
              </div>
            )}
            {loading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <DriverTable drivers={drivers} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverList;
