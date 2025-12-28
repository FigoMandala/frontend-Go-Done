// src/api/backend.js
import axios from "axios";

const backend = axios.create({
  baseURL: "http://backend-go-done-production.up.railway.app", 
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
    }
    return Promise.reject(err);
  }
);

export default backend;
