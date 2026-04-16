import { api } from "./api";

export const getBatches = () => api.get("/batch");

export const getBatchById = (id) => api.get(`/batch/${id}`);

export const getActiveBatch = () => api.get("/batch/active");

export const createBatch = (data) =>
  api.post("/batch", data);

export const updateBatch = (id, data) =>
  api.put(`/batch/${id}`, data);

export const closeBatch = (id) =>
  api.put(`/batch/${id}/close`);

export const deleteBatch = (id) =>
  api.delete(`/batch/${id}`);