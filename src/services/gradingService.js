import { api } from './api'
export const getGradings = () => api.get("/gradings");

export const getGradingsByBatch = (batchId) =>
  api.get(`/gradings?batch_id=${batchId}`)

export const getGradingById = (id) =>
  api.get(`/gradings/${id}`)

// createGrading menerima FormData (multipart) karena ada upload foto
export const createGrading = (formData) =>
  api.post('/gradings', formData)

export const getGradingByQr = (qrToken) =>
  api.get(`/gradings/qr/${qrToken}`)
// import { api } from "./api";

// export const getGradings = () => api.get("/grading");

// export const getGradingById = (id) => api.get(`/grading/${id}`);

// export const getGradingByBatch = (batchId) =>
//   api.get(`/grading/batch/${batchId}`);

// export const createGrading = (data) =>
//   api.post("/grading", data);

// export const updateGrading = (id, data) =>
//   api.put(`/grading/${id}`, data);

// export const deleteGrading = (id) =>
//   api.delete(`/grading/${id}`);