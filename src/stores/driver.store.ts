import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { driverApi } from "../api/endpoints/driver.api";
import {
  Driver,
  DriverLocation,
  DriverAvailability,
} from "./types/driver.types";
import { jwtDecode } from "jwt-decode";

export interface DriverState {
  drivers: Driver[];
  currentDriver: Driver | null;
  nearbyDrivers: Driver[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface DriverActions {
  createDriver: (
    driverData: Omit<Driver, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  fetchDrivers: (
    filters?: any,
    page?: number,
    pageSize?: number
  ) => Promise<void>;
  fetchDriverById: (id: number) => Promise<void>;
  updateDriver: (id: number, updates: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: number) => Promise<void>;
  updateDriverStatus: (
    id: number,
    status: "offline" | "online" | "on_trip"
  ) => Promise<void>;
  updateDriverLocation: (
    id: number,
    location: { lat: number; lng: number }
  ) => Promise<void>;
  fetchNearbyDrivers: (
    lat: number,
    lng: number,
    radius?: number,
    companyId?: number
  ) => Promise<void>;
  addDriverAvailability: (
    data: Omit<DriverAvailability, "id">
  ) => Promise<void>;
  removeDriverAvailability: (id: number) => Promise<void>;
  clearDriverData: () => void;
}

export const useDriverStore = create<DriverState & DriverActions>()(
  immer((set) => ({
    drivers: [],
    currentDriver: null,
    nearbyDrivers: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
    },

    createDriver: async (driverData) => {
      set({ loading: true, error: null });
      try {
        const driver = await driverApi.createDriver(driverData);
        set((state) => {
          state.drivers.push(driver);
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to create driver",
          loading: false,
        });
      }
    },

    fetchDrivers: async (filters = {}) => {
      set({ loading: true, error: null });
      const token = localStorage.getItem("authToken") || "";
      const decoded = jwtDecode(token) as any;
      const companyId = decoded.companyId;

      try {
        const response = (await driverApi.getAllDrivers(
          filters,
          companyId
        )) as any;
        set({
          drivers: response.data,
          pagination: response.pagination,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch drivers",
          loading: false,
        });
      }
    },

    fetchDriverById: async (id) => {
      set({ loading: true, error: null });
      try {
        const driver = (await driverApi.getDriverById(id)) as any;
        set({ currentDriver: driver.data, loading: false });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch driver",
          loading: false,
        });
      }
    },

    updateDriver: async (id, updates) => {
      set({ loading: true, error: null });
      try {
        const updatedDriver = await driverApi.updateDriver(id, updates);
        set((state) => {
          const index = state.drivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            state.drivers[index] = updatedDriver;
          }
          if (state.currentDriver && state.currentDriver.id === id) {
            state.currentDriver = updatedDriver;
          }
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to update driver",
          loading: false,
        });
      }
    },

    deleteDriver: async (id) => {
      set({ loading: true, error: null });
      try {
        await driverApi.deleteDriver(id);
        set((state) => {
          state.drivers = state.drivers.filter((d) => d.id !== id);
          if (state.currentDriver && state.currentDriver.id === id) {
            state.currentDriver = null;
          }
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to delete driver",
          loading: false,
        });
      }
    },

    updateDriverStatus: async (id, status) => {
      set({ loading: true, error: null });
      try {
        const updatedDriver = await driverApi.updateDriverStatus(id, status);
        set((state) => {
          const index = state.drivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            state.drivers[index].status = updatedDriver.status;
          }
          if (state.currentDriver && state.currentDriver.id === id) {
            state.currentDriver.status = updatedDriver.status;
          }
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to update driver status",
          loading: false,
        });
      }
    },

    updateDriverLocation: async (id, location) => {
      set({ loading: true, error: null });
      try {
        const updatedLocation = await driverApi.updateDriverLocation(
          id,
          location
        );
        set((state) => {
          const driverIndex = state.drivers.findIndex((d) => d.id === id);
          if (driverIndex !== -1) {
            state.drivers[driverIndex].location = updatedLocation;
          }
          if (state.currentDriver && state.currentDriver.id === id) {
            state.currentDriver.location = updatedLocation;
          }
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to update driver location",
          loading: false,
        });
      }
    },

    fetchNearbyDrivers: async (lat, lng, radius = 5, companyId = null) => {
      set({ loading: true, error: null });
      try {
        const drivers = await driverApi.getNearbyDrivers(
          lat,
          lng,
          radius,
          companyId
        );
        set({ nearbyDrivers: drivers, loading: false });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch nearby drivers",
          loading: false,
        });
      }
    },

    addDriverAvailability: async (data) => {
      set({ loading: true, error: null });
      try {
        const availability = await driverApi.addDriverAvailability(data);
        set((state) => {
          if (state.currentDriver && state.currentDriver.id === data.driverId) {
            if (!state.currentDriver.availability) {
              state.currentDriver.availability = [];
            }
            state.currentDriver.availability.push(availability);
          }
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to add driver availability",
          loading: false,
        });
      }
    },

    removeDriverAvailability: async (id) => {
      set({ loading: true, error: null });
      try {
        await driverApi.removeDriverAvailability(id);
        set((state) => {
          if (state.currentDriver && state.currentDriver.availability) {
            state.currentDriver.availability =
              state.currentDriver.availability.filter((a) => a.id !== id);
          }
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to remove driver availability",
          loading: false,
        });
      }
    },

    clearDriverData: () => {
      set({
        drivers: [],
        currentDriver: null,
        nearbyDrivers: [],
        error: null,
      });
    },
  }))
);
