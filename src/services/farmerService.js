import { api } from "./api";

export const getFarmers = () => api.get("/farmer");

export const getFarmerById = (id) =>
  api.get(`/farmer/${id}`);

export const createFarmer = (data) =>
  api.post("/farmer", data);

export const updateFarmer = (id, data) =>
  api.put(`/farmer/${id}`, data);

export const deleteFarmer = (id) =>
  api.delete(`/farmer/${id}`);