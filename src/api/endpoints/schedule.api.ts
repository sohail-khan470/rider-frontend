// src/api/endpoints/schedule.api.ts
import { CreateScheduleData, Schedule } from "../../stores/schedule.store";
import apiClient from "../client";

export const scheduleApi = {
  createSchedule: async (data: CreateScheduleData): Promise<Schedule> => {
    const response = await apiClient.post("/api/schedules", data);
    return response.data;
  },

  updateSchedule: async (
    id: number,
    data: Partial<CreateScheduleData>
  ): Promise<Schedule> => {
    const response = await apiClient.put(`/api/schedules/${id}`, data);
    return response.data;
  },

  cancelSchedule: async (id: number): Promise<Schedule> => {
    const response = await apiClient.patch(`/api/schedules/${id}/cancel`);
    return response.data;
  },

  startTrip: async (id: number): Promise<Schedule> => {
    const response = await apiClient.patch(`/api/schedules/${id}/start`);
    return response.data;
  },

  markArrived: async (id: number): Promise<Schedule> => {
    const response = await apiClient.patch(`/api/schedules/${id}/arrived`);
    return response.data;
  },

  startReturn: async (id: number): Promise<Schedule> => {
    const response = await apiClient.patch(`/api/schedules/${id}/return`);
    return response.data;
  },

  completeSchedule: async (id: number): Promise<Schedule> => {
    const response = await apiClient.patch(`/api/schedules/${id}/complete`);
    return response.data;
  },

  getAvailableReturnSchedules: async (
    cityId: number,
    destinationCityId: number
  ): Promise<Schedule[]> => {
    const response = await apiClient.get(
      `/api/schedules/available-return/${cityId}/${destinationCityId}`
    );
    return response.data;
  },

  getScheduleById: async (id: number): Promise<Schedule> => {
    const response = await apiClient.get(`/api/schedules/${id}`);
    return response.data;
  },

  getCompanySchedules: async (companyId: number): Promise<Schedule[]> => {
    const response = await apiClient.get(`/api/schedules/company/${companyId}`);
    return response.data;
  },
};
