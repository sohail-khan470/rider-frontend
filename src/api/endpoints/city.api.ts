// api/endpoints/city.api.ts
import { City } from "../../stores/types/city.types";
import apiClient from "../client";

export const cityApi = {
  createCity: async (name: string): Promise<City> => {
    const response = await apiClient.post("/api/cities", { name });
    return response.data;
  },

  getCities: async (): Promise<City[]> => {
    const response = await apiClient.get("/api/cities");
    return response.data;
  },

  getCityById: async (id: number): Promise<City> => {
    const response = await apiClient.get(`/api/cities/${id}`);
    return response.data;
  },

  updateCity: async (id: number, name: string): Promise<City> => {
    const response = await apiClient.patch(`/api/cities/${id}`, { name });
    return response.data;
  },

  deleteCity: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/cities/${id}`);
  },
};
