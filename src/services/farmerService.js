import { api } from "./api";

export const getFarmers = () => api.get("/farmers");

export const getFarmerById = (id) =>
  api.get(`/farmers/${id}`);

export const createFarmer = (data) =>
  api.post("/farmers", data);

export const updateFarmer = (id, data) =>
  api.put(`/farmers/${id}`, data);

export const deleteFarmer = (id) =>
  api.delete(`/farmers/${id}`);