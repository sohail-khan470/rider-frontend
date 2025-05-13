// src/pages/DriverManagement/DriverForm.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDriverStore } from "../../store/driver.store";
import Breadcrumb from "../../components/Breadcrumb";
import LoadingSpinner from "../../components/LoadingSpinner";

const DriverForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const {
    currentDriver,
    loading,
    error,
    fetchDriverById,
    createDriver,
    updateDriver,
  } = useDriverStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleInfo: "",
    companyId: 0,
    status: "offline",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && id) {
      fetchDriverById(parseInt(id));
    }
  }, [isEditMode, id]);

  useEffect(() => {
    if (isEditMode && currentDriver) {
      setFormData({
        name: currentDriver.name,
        email: currentDriver.email,
        phone: currentDriver.phone,
        vehicleInfo: currentDriver.vehicleInfo,
        companyId: currentDriver.companyId,
        status: currentDriver.status,
      });
    }
  }, [currentDriver, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "companyId" ? parseInt(value) : value,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email is required";
    }

    if (!formData.phone || formData.phone.length < 10) {
      errors.phone = "Phone must be at least 10 characters";
    }

    if (!formData.vehicleInfo || formData.vehicleInfo.length < 5) {
      errors.vehicleInfo = "Vehicle info must be at least 5 characters";
    }

    if (!formData.companyId) {
      errors.companyId = "Company is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditMode && id) {
      await updateDriver(parseInt(id), formData);
      if (!error) {
        navigate(`/drivers/${id}`);
      }
    } else {
      await createDriver(formData);
      if (!error) {
        navigate("/drivers");
      }
    }
  };

  if (loading && isEditMode) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName={isEditMode ? "Edit Driver" : "Create Driver"} />

      <div className="rounded-sm border border-stroke bg-white shadow-default p-4 md:p-6 xl:p-7.5">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditMode ? "Edit Driver Information" : "Add New Driver"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-black">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded border ${
                  formErrors.name ? "border-red-300" : "border-stroke"
                } py-3 px-4 focus:border-primary focus-visible:outline-none`}
                placeholder="Driver Name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded border ${
                  formErrors.email ? "border-red-300" : "border-stroke"
                } py-3 px-4 focus:border-primary focus-visible:outline-none`}
                placeholder="Email Address"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-black">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full rounded border ${
                  formErrors.phone ? "border-red-300" : "border-stroke"
                } py-3 px-4 focus:border-primary focus-visible:outline-none`}
                placeholder="Phone Number"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-black">
                Vehicle Information
              </label>
              <input
                type="text"
                name="vehicleInfo"
                value={formData.vehicleInfo}
                onChange={handleChange}
                className={`w-full rounded border ${
                  formErrors.vehicleInfo ? "border-red-300" : "border-stroke"
                } py-3 px-4 focus:border-primary focus-visible:outline-none`}
                placeholder="Vehicle Details"
              />
              {formErrors.vehicleInfo && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.vehicleInfo}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-black">Company</label>
              <input
                type="number"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className={`w-full rounded border ${
                  formErrors.companyId ? "border-red-300" : "border-stroke"
                } py-3 px-4 focus:border-primary focus-visible:outline-none`}
                placeholder="Company ID"
              />
              {formErrors.companyId && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.companyId}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-black">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded border border-stroke py-3 px-4 focus:border-primary focus-visible:outline-none"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="on_trip">On Trip</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate("/drivers")}
              className="inline-flex items-center justify-center border border-stroke py-2 px-6 mr-4 rounded-md text-black hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-primary py-2 px-6 text-white rounded-md hover:bg-opacity-90"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Driver"
                : "Create Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;
