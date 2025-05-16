// src/api/client.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token and checking expiration
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      // Check token expiration
      const decoded = jwtDecode(token) as { exp: number };
      const isExpired = Date.now() >= decoded.exp * 1000;

      if (isExpired) {
        // Clear expired token and redirect
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        window.location.href = "/"; // Full page reload to reset app state
        return Promise.reject(new Error("Token expired"));
      }

      // Add valid token to headers
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      // Invalid token format
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      window.location.href = "/";
      return Promise.reject(new Error("Invalid token"));
    }
  }

  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (token invalid or server rejected)
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
