// src/api/backend.js
import axios from "axios";

const backend = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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

// (Opsional) Tangani 401/403 global
backend.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Misalnya: redirect ke login bila token invalid/expired
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default backend;
