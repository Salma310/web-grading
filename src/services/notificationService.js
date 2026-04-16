import { api } from "./api";

export const getNotifications = () =>
  api.get("/notification");

export const createNotification = (data) =>
  api.post("/notification", data);