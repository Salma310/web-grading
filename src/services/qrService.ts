import { api } from "./api";

export const getQRImage = (token: string) => api.get(`/qr/${token}/image`);
export const getQRDetail = (token: string) => api.get(`/qr/${token}`);
export const getQRLogs = (token: string) => api.get(`/qr/${token}/logs`);
export const markAsPrinted = (token: string, printed_by_id: string) =>
  api.patch(`/qr/${token}/print`, { printed_by_id });
export const deactivateQR = (token: string, reason?: string) =>
  api.patch(`/qr/${token}/deactivate`, { reason });