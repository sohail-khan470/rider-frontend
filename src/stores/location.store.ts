// src/stores/location.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { driverApi } from "../api/endpoints/driver.api";
import { Location } from "./types/driver.types";
import apiClient from "../api/client";

type LocationState = {
  driverLocations: Record<number, Location>;
  loading: boolean;
  error: string | null;
};

type LocationActions = {
  updateDriverLocation: (
    driverId: number,
    location: { lat: number; lng: number }
  ) => Promise<void>;
  getDriverLocation: (driverId: number) => Promise<void>;
};

export const useLocationStore = create<LocationState & LocationActions>()(
  immer((set) => ({
    driverLocations: {},
    loading: false,
    error: null,

    updateDriverLocation: async (driverId, location) => {
      set({ loading: true, error: null });
      try {
        const updatedLocation = await driverApi.updateLocation(location);
        set((state) => {
          state.driverLocations[driverId] = updatedLocation;
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to update location", loading: false });
      }
    },

    getDriverLocation: async (driverId) => {
      set({ loading: true, error: null });
      try {
        // This would need a new endpoint in your API
        const location = await apiClient.get(`/drivers/${driverId}/location`);
        set((state) => {
          state.driverLocations[driverId] = location.data;
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to fetch driver location", loading: false });
      }
    },
  }))
);
