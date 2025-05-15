import apiClient from "../client";
import {
  Driver,
  DriverLocation,
  DriverAvailability,
} from "../../stores/types/driver.types";

export const driverApi = {
  // Driver CRUD operations
  createDriver: async (
    driverData: Omit<Driver, "id" | "createdAt" | "updatedAt">
  ): Promise<Driver> => {
    const response = await apiClient.post("/api/drivers", driverData);
    return response.data;
  },

  getAllDrivers: async (filters = {}, companyId: string) => {
    const queryParams = new URLSearchParams();
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    // Add companyId to the query string
    if (companyId) {
      queryParams.append("companyId", companyId);
    }

    const response = await apiClient.get(
      `/api/drivers?${queryParams.toString()}`
    );

    return response.data;
  },

  getDriverById: async (id: number): Promise<Driver> => {
    const response = await apiClient.get(`/api/drivers/${id}`);
    return response.data;
  },

  updateDriver: async (
    id: number,
    updates: Partial<Driver>
  ): Promise<Driver> => {
    const response = await apiClient.patch(`/api/drivers/${id}`, updates);
    return response.data;
  },

  deleteDriver: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/drivers/${id}`);
  },

  // Driver status management
  updateDriverStatus: async (
    id: number,
    status: "offline" | "online" | "on_trip"
  ): Promise<Driver> => {
    const response = await apiClient.patch(`/api/drivers/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Driver location management
  updateDriverLocation: async (
    id: number,
    location: { lat: number; lng: number }
  ): Promise<DriverLocation> => {
    const response = await apiClient.patch(
      `/api/drivers/${id}/location`,
      location
    );
    return response.data;
  },

  getNearbyDrivers: async (
    lat: number,
    lng: number,
    radius = 5,
    companyId = null
  ): Promise<Driver[]> => {
    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
    });

    if (companyId) {
      queryParams.append("companyId", companyId.toString());
    }

    const response = await apiClient.get(
      `/drivers/nearby?${queryParams.toString()}`
    );
    return response.data;
  },

  // Driver availability management
  addDriverAvailability: async (
    data: Omit<DriverAvailability, "id">
  ): Promise<DriverAvailability> => {
    const response = await apiClient.post("/api/drivers/availability", data);
    return response.data;
  },

  removeDriverAvailability: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/drivers/availability/${id}`);
  },

  // Company specific driver operations
  getCompanyDrivers: async (
    companyId: number,
    filters = {},
    pagination = { skip: 0, take: 10 }
  ) => {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    queryParams.append("skip", pagination.skip.toString());
    queryParams.append("take", pagination.take.toString());

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `/companies/${companyId}/api/drivers?${queryParams.toString()}`
    );
    return response.data;
  },
};
