// src/stores/city.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
// import { cityApi } from "../api/endpoints/city.api";
import { cityApi } from "../api/endpoints/city.api";
import { City } from "./types/city.types";
import { toast } from "react-toastify";

type CityState = {
  cities: City[];
  currentCity: City | null;
  loading: boolean;
  error: string | null;
};

type CityActions = {
  createCity: (name: string) => Promise<void>;
  fetchCities: () => Promise<void>;
  getCityById: (id: number) => Promise<void>;
  updateCity: (id: number, name: string) => Promise<void>;
  deleteCity: (id: number) => Promise<void>;
  clearError: () => void;
  setCurrentCity: (city: City | null) => void;
};

export const useCityStore = create<CityState & CityActions>()(
  immer((set) => ({
    cities: [],
    currentCity: null,
    loading: false,
    error: null,

    createCity: async (name: string) => {
      set({ loading: true, error: null });
      try {
        const city = await cityApi.createCity(name);
        set((state) => {
          state.cities.push(city);
          state.loading = false;
        });
        toast.success("City created successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create city";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    fetchCities: async () => {
      set({ loading: true, error: null });
      try {
        const cities = (await cityApi.getCities()) as any;
        const data = cities.result.data;
        set({ cities: data, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch cities";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    getCityById: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const city = await cityApi.getCityById(id);
        set({ currentCity: city, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch city";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    updateCity: async (id: number, name: string) => {
      set({ loading: true, error: null });
      try {
        const city = await cityApi.updateCity(id, name);
        set((state) => {
          const index = state.cities.findIndex((c) => c.id === id);
          if (index !== -1) {
            state.cities[index] = city;
          }
          if (state.currentCity?.id === id) {
            state.currentCity = city;
          }
          state.loading = false;
        });
        toast.success("City updated successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update city";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    deleteCity: async (id: number) => {
      set({ loading: true, error: null });
      try {
        await cityApi.deleteCity(id);
        set((state) => {
          state.cities = state.cities.filter((city) => city.id !== id);
          if (state.currentCity?.id === id) {
            state.currentCity = null;
          }
          state.loading = false;
        });
        toast.success("City deleted successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete city";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    clearError: () => {
      set({ error: null });
    },

    setCurrentCity: (city: City | null) => {
      set({ currentCity: city });
    },
  }))
);
