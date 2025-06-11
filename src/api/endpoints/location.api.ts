import apiClient from "../client";
import { Location, SearchedLocation } from "../types/location.types";

export const locationApi = {
  // Driver location methods
  updateDriverLocation: async (
    driverId: number,
    location: { lat: number; lng: number }
  ): Promise<Location> => {
    const response = await apiClient.put(
      `/api/locations/${driverId}/update`,
      location
    );
    return response.data;
  },

  getDriverLocation: async (driverId: number): Promise<Location> => {
    const response = await apiClient.get(
      `/api/locations/${driverId}/getLocation`
    );
    return response.data;
  },

  // Location search methods
  searchLocation: async (searchTerm: string): Promise<SearchedLocation[]> => {
    const response = await apiClient.post("/api/locations/search", {
      searchTerm,
    });
    return response.data;
  },

  getAllLocations: async (): Promise<SearchedLocation[]> => {
    const response = await apiClient.get("/api/locations");
    return response.data;
  },

  // If you need basic CRUD operations for locations
  getLocationById: async (id: number): Promise<Location> => {
    const response = await apiClient.get(`/api/locations/${id}`);
    return response.data;
  },

  createLocation: async (data: Omit<Location, "id">): Promise<Location> => {
    const response = await apiClient.post("/api/locations", data);
    return response.data;
  },

  updateLocation: async (
    id: number,
    data: Partial<Location>
  ): Promise<Location> => {
    const response = await apiClient.put(`/api/locations/${id}`, data);
    return response.data;
  },

  deleteLocation: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/locations/${id}`);
  },
};
