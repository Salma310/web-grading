import { api } from "./api";

export const getLands = () => api.get("/land");

export const getLandById = (id) =>
  api.get(`/land/${id}`);

export const createLand = (data) =>
  api.post("/land", data);

export const updateLand = (id, data) =>
  api.put(`/land/${id}`, data);

export const deleteLand = (id) =>
  api.delete(`/land/${id}`);