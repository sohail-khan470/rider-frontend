// api/endpoints/driver.api.ts

import apiClient from "../client";
import {
  Driver,
  DriverStatus,
  CreateDriverData,
  UpdateDriverData,
  LocationData,
  AvailabilityData,
} from "../../stores/driver.store";

export const driverApi = {
  createDriver: async (driverData: CreateDriverData): Promise<Driver> => {
    const response = await apiClient.post("/api/drivers", driverData);
    return response.data;
  },

  getDrivers: async (companyId: number) => {
    const response = await apiClient.get(`/api/drivers/company/${companyId}`);
    return response.data;
  },

  getDriverById: async (id: number): Promise<Driver> => {
    const response = await apiClient.get(`/api/drivers/${id}`);
    return response.data;
  },

  updateDriver: async (id: number, data: UpdateDriverData): Promise<Driver> => {
    const response = await apiClient.patch(`/api/drivers/${id}`, data);
    return response.data;
  },

  deleteDriver: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/drivers/${id}`);
  },

  updateDriverStatus: async (
    id: number,
    status: DriverStatus
  ): Promise<Driver> => {
    const response = await apiClient.patch(`/api/drivers/${id}/status`, {
      status,
    });
    return response.data;
  },

  updateDriverLocation: async (id: number, location: LocationData) => {
    const response = await apiClient.patch(
      `/api/drivers/${id}/location`,
      location
    );
    return response.data;
  },

  addDriverAvailability: async (data: AvailabilityData) => {
    const response = await apiClient.post("/api/drivers/availability", data);
    return response.data;
  },

  removeDriverAvailability: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/drivers/availability/${id}`);
  },

  getDriversByStatus: async (status: DriverStatus): Promise<Driver[]> => {
    const response = await apiClient.get(`/api/drivers/status/${status}`);
    return response.data;
  },

  getAvailableDrivers: async (companyId: number): Promise<Driver[]> => {
    const response = await apiClient.get(`/api/drivers/available/${companyId}`);
    return response.data;
  },

  getDriverStatistics: async (driverId: number) => {
    const response = await apiClient.get(`/api/drivers/${driverId}/statistics`);
    return response.data;
  },

  getDriverCurrentLocation: async (driverId: number) => {
    const response = await apiClient.get(`/api/drivers/${driverId}/location`);
    return response.data;
  },

  getDriverAvailability: async (driverId: number) => {
    const response = await apiClient.get(
      `/api/drivers/${driverId}/availability`
    );
    return response.data;
  },

  validateDriverCredentials: async (
    email: string,
    phone: string
  ): Promise<{ valid: boolean; message?: string }> => {
    const response = await apiClient.post("/api/drivers/validate", {
      email,
      phone,
    });
    return response.data;
  },
};
