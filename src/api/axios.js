import axios from "axios";
import { getAdminAuth } from "../utils/adminAuth";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(config => {
  // Only add auth header for admin endpoints that require authentication
  if (config.url && (
    config.url.includes('admin/') ||
    config.url.includes('appointments/') && config.url.includes('status/')
  ) && !config.url.includes('admin/login/')) {
    const token = getAdminAuth();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
