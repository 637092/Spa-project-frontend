import axios from "axios";
import { getAdminAuth } from "../utils/adminAuth";

const api = axios.create({
  baseURL: "https://spa-project-backend-1.onrender.com/api/",
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
