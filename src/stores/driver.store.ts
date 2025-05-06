// src/stores/driver.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { driverApi } from "../api/endpoints/driver.api";
import { Driver } from "../api/types/driver.types";

import { DriverActions, DriverState } from "./types/driver.types";

export const useDriverStore = create<DriverState & DriverActions>()(
  immer((set) => ({
    drivers: [],
    currentDriver: null,
    availabilities: [],
    location: null,
    loading: false,
    error: null,

    fetchDrivers: async () => {
      set({ loading: true, error: null });
      try {
        const drivers = await driverApi.getCompanyDrivers();
        set({ drivers, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch drivers", loading: false });
      }
    },

    createDriver: async (driverData) => {
      set({ loading: true, error: null });
      try {
        const driver = await driverApi.createDriver(driverData);
        set((state) => {
          state.drivers.push(driver);
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to create driver", loading: false });
      }
    },

    updateDriver: async (driverId, updates) => {
      set({ loading: true, error: null });
      try {
        const updatedDriver = await driverApi.updateDriver(driverId, updates);
        set((state) => {
          const index = state.drivers.findIndex(
            (d: Driver) => d.id === driverId
          );
          if (index !== -1) {
            state.drivers[index] = updatedDriver;
          }
          if (state.currentDriver?.id === driverId) {
            state.currentDriver = updatedDriver;
          }
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to update driver", loading: false });
      }
    },

    deleteDriver: async (driverId) => {
      set({ loading: true, error: null });
      try {
        await driverApi.deleteDriver(driverId);
        set((state) => {
          state.drivers = state.drivers.filter(
            (d: Driver) => d.id !== driverId
          );
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to delete driver", loading: false });
      }
    },

    getDriverProfile: async () => {
      set({ loading: true, error: null });
      try {
        const driver = await driverApi.getDriverProfile();
        set({ currentDriver: driver, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch driver profile", loading: false });
      }
    },

    updateDriverStatus: async (status) => {
      set({ loading: true, error: null });
      try {
        const driver = await driverApi.updateStatus(status);
        set({ currentDriver: driver, loading: false });
      } catch (error) {
        set({ error: "Failed to update status", loading: false });
      }
    },

    updateDriverLocation: async (location) => {
      set({ loading: true, error: null });
      try {
        const updatedLocation = await driverApi.updateLocation(location);
        set({ location: updatedLocation, loading: false });
      } catch (error) {
        set({ error: "Failed to update location", loading: false });
      }
    },

    setAvailability: async (availability) => {
      set({ loading: true, error: null });
      try {
        const newAvailability = await driverApi.setAvailability(availability);
        set((state) => {
          state.availabilities.push(newAvailability);
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to set availability", loading: false });
      }
    },

    getAvailabilities: async () => {
      set({ loading: true, error: null });
      try {
        const availabilities = await driverApi.getAvailabilities();
        set({ availabilities, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch availabilities", loading: false });
      }
    },

    getAllDrivers: async () => {
      set({ loading: true, error: null });
      try {
        const response = await driverApi.getAllDrivers();
        set({ drivers: response.data, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch all drivers", loading: false });
      }
    },
  }))
);
