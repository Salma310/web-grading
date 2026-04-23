import { api } from "./api";

export const getLands = () => api.get("/land");

export const getLandById = (id : string) =>
  api.get(`/land/${id}`);

export const createLand = (data: object) =>
  api.post("/land", data);

export const updateLand = (id: string, data: object) =>
  api.put(`/land/${id}`, data);

export const deleteLand = (id: string) =>
  api.delete(`/land/${id}`);