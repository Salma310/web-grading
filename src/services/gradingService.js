import { api } from "./api";

export const getGradings = () => api.get("/grading");

export const getGradingById = (id) => api.get(`/grading/${id}`);

export const getGradingByBatch = (batchId) =>
  api.get(`/grading/batch/${batchId}`);

export const createGrading = (data) =>
  api.post("/grading", data);

export const updateGrading = (id, data) =>
  api.put(`/grading/${id}`, data);

export const deleteGrading = (id) =>
  api.delete(`/grading/${id}`);