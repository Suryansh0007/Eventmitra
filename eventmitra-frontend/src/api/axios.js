import axios from "axios";
import { API_BASE_URL } from "./baseUrl";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const publicAuthPaths = ["/auth/login", "/auth/register", "/otp/send", "/otp/verify"];
  if (publicAuthPaths.includes(config.url)) {
    return config;
  }

  const token = localStorage.getItem("em_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handling -> log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("em_token");
      localStorage.removeItem("em_user");
    }
    return Promise.reject(error);
  }
);

export default api;
