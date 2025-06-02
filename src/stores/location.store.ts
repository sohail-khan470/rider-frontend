// src/stores/location.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { locationApi } from "../api/endpoints/location.api";

export type Location = {
  id: number;
  driverId?: number;
  lat: number;
  lng: number;
  address?: string;
  updatedAt: string;
};

export type SearchedLocation = {
  lat: number;
  lng: number;
  address: string;
  display_name?: string;
};

type LocationState = {
  driverLocations: Record<number, Location>;
  searchedLocations: SearchedLocation[];
  loading: boolean;
  error: string | null;
};

type LocationActions = {
  // Existing driver location methods
  updateDriverLocation: (
    driverId: number,
    location: { lat: number; lng: number }
  ) => Promise<void>;
  getDriverLocation: (driverId: number) => Promise<void>;

  // New location search methods
  searchLocation: (searchTerm: string) => Promise<void>;
  clearSearchedLocations: () => void;
  getAllLocations: () => Promise<void>;
};

export const useLocationStore = create<LocationState & LocationActions>()(
  immer((set) => ({
    driverLocations: {},
    searchedLocations: [],
    loading: false,
    error: null,

    //added current update driver location

    updateDriverLocation: async (driverId, location) => {
      set({ loading: true, error: null });
      try {
        const response = locationApi.updateDriverLocation(
          driverId,
          location
        ) as any;
        set((state) => {
          state.driverLocations[driverId] = response;
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to update location", loading: false });
      }
    },

    getDriverLocation: async (driverId) => {
      set({ loading: true, error: null });
      try {
        const response = locationApi.getDriverLocation(driverId) as any;
        set((state) => {
          state.driverLocations[driverId] = response;
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to fetch driver location", loading: false });
      }
    },

    searchLocation: async (searchTerm) => {
      console.log("***searchLocation***");
      set({ loading: true, error: null });
      try {
        const response = (await locationApi.searchLocation(searchTerm)) as any;
        console.log(response);
        set((state) => {
          state.searchedLocations = response;
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to search location", loading: false });
      }
    },

    clearSearchedLocations: () => {
      set((state) => {
        state.searchedLocations = [];
      });
    },

    getAllLocations: async () => {
      set({ loading: true, error: null });
      try {
        const response = (await locationApi.getAllLocations()) as any;
        console.log(response.data);
        set((state) => {
          state.searchedLocations = response;
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to fetch locations", loading: false });
      }
    },
  }))
);
