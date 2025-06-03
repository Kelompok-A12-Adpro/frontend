"use client";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("token");
        const response = await axios.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        // Store the new access token
        const { access } = response.data;
        localStorage.setItem("token", access);

        // Update the authorization header and retry
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        // Clear tokens
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("token");

        // Redirect to login page
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const serviceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

serviceApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

serviceApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("token");
        const response = await axios.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        // Store the new access token
        const { access } = response.data;
        localStorage.setItem("token", access);

        // Update the authorization header and retry
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        // Clear tokens
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("token");

        // Redirect to login page
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
