import { api } from "./api";

/**
 * Semua stats dashboard dalam satu call
 * (summary + monthly trend + recent batches + top farmers + AI confidence)
 */
export const getDashboardStats = () => api.get("/dashboard/stats");

/**
 * Hanya kartu metrics ringkasan
 * Cocok di-poll tiap beberapa detik untuk live update
 */
export const getDashboardSummary = () => api.get("/dashboard/summary");

/**
 * Data grading per grade per bulan (12 bulan terakhir)
 */
export const getMonthlyTrend = () => api.get("/dashboard/monthly-trend");

/**
 * Batch terbaru beserta info petani & lahan
 * @param {number} limit - Jumlah batch yang diambil (default: 8, max: 50)
 */
export const getRecentBatches = (limit = 8) =>
  api.get("/dashboard/recent-batches", { params: { limit } });

/**
 * Top petani berdasarkan Grade A bulan ini
 * @param {number} limit - Jumlah petani yang diambil (default: 5, max: 20)
 */
export const getTopFarmers = (limit = 5) =>
  api.get("/dashboard/top-farmers", { params: { limit } });