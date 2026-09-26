import axios from "axios";

const configuredApiUrl = (
  import.meta.env.VITE_API_URL ||
  "https://servigo-localservice-marketplace.onrender.com"
).replace(/\/+$/, "");
const apiBaseURL = configuredApiUrl.endsWith("/api/v1")
  ? configuredApiUrl
  : `${configuredApiUrl}/api/v1`;

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("servigo_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("servigo:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;
