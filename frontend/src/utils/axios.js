// src/utils/api.js
import axios from "axios";

// ✅ Single source of truth for backend URL
// - Use VITE_API_URL everywhere (both dev and prod)
// - Fallback to localhost:5000 if not set (for dev)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  // ❌ You are not using cookies, only Bearer tokens → no need for withCredentials
  withCredentials: false,
});

// ✅ Attach Authorization header automatically if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;