import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api",

  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const requestUrl = error.config?.url ?? "";
      const isLoginRequest = /\/auth\/(?:login|admin\/login|staff\/login)$/.test(
        requestUrl,
      );

      if (!isLoginRequest) {
        localStorage.removeItem("access_token");

        const loginPath = window.location.pathname.startsWith("/staff")
          ? "/staff/login"
          : "/login";

        if (window.location.pathname !== loginPath) {
          window.location.replace(loginPath);
        }
      }
    }

    return Promise.reject(error);
  },
);