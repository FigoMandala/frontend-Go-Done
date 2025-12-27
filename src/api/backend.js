// src/api/backend.js
import axios from "axios";

// Use production URL or fallback to localhost for development
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const backend = axios.create({
  baseURL,
  timeout: 10000,
});

// Inject Authorization header
backend.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

backend.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default backend;
