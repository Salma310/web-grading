import { api } from "./api";

export const getQRLogs = () => api.get("/qr");

export const createQRLog = (data) =>
  api.post("/qr", data);

// 🔥 OPTIONAL (kalau kamu buat endpoint scan)
export const getQRDetail = (token) =>
  api.get(`/qr/${token}`);