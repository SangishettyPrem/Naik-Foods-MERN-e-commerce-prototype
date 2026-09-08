import axios from "axios";

// Resolves backend API URL:
// 1. Explicit VITE_API_URL environment variable if configured on Netlify
// 2. Production fallback pointing to live Render backend
// 3. Local development fallback using Vite proxy (/api)
const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const base = import.meta.env.VITE_API_URL.replace(/\/$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
  }
  if (import.meta.env.PROD) {
    return "https://naik-foods-mern-e-commerce-prototype.onrender.com/api";
  }
  return "/api";
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred. Please try again.";
    console.error("[API Error]:", message);
    return Promise.reject(new Error(message));
  },
);

export default api;
