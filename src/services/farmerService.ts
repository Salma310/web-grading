import { api } from "./api";

export const getFarmers = () => api.get("/farmers");

export const getFarmerById = (id: string) =>
  api.get(`/farmers/${id}`);

export const createFarmer = (payload: object) =>
  api.post("/farmers", payload);

export const updateFarmer = (id: string, data: object) =>
  api.put(`/farmers/${id}`, data);

export const deleteFarmer = (id: string) =>
  api.delete(`/farmers/${id}`);