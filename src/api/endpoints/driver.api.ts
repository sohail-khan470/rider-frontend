// src/api/endpoints/driver.api.ts
import { DriverResponse } from "../../stores/types/driver.types";
import apiClient from "../client";

import {
  Driver,
  DriverStatus,
  DriverAvailability,
} from "../types/driver.types";

export const driverApi = {
  // Company endpoints
  getCompanyDrivers: async (): Promise<Driver[]> => {
    const response = await apiClient.get("/api/companies/drivers");
    return response.data;
  },

  createDriver: async (
    driverData: Omit<Driver, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<Driver> => {
    const response = await apiClient.post("/api/company/drivers", driverData);
    return response.data;
  },

  updateDriver: async (
    driverId: number,
    updates: Partial<Driver>
  ): Promise<Driver> => {
    const response = await apiClient.patch(
      `/companies/drivers/${driverId}`,
      updates
    );
    return response.data;
  },

  deleteDriver: async (driverId: number): Promise<void> => {
    await apiClient.delete(`/api/company/drivers/${driverId}`);
  },

  // Driver endpoints
  getDriverProfile: async (): Promise<Driver> => {
    const response = await apiClient.get("/api/drivers/me");
    return response.data;
  },

  updateStatus: async (status: DriverStatus): Promise<Driver> => {
    const response = await apiClient.patch("/api/drivers/status", { status });
    return response.data;
  },

  updateLocation: async (location: {
    lat: number;
    lng: number;
  }): Promise<Location> => {
    const response = await apiClient.post("/drivers/location", location);
    return response.data;
  },

  // Availability
  setAvailability: async (availability: {
    startTime: string;
    endTime: string;
  }): Promise<DriverAvailability> => {
    const response = await apiClient.post(
      "/drivers/availability",
      availability
    );
    return response.data;
  },

  getAvailabilities: async (): Promise<DriverAvailability[]> => {
    const response = await apiClient.get("/drivers/availability");
    return response.data;
  },

  getAllDrivers: async (): Promise<DriverResponse> => {
    const response = await apiClient.get("/api/drivers/getAll");
    return response.data;
  },
};
