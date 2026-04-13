import axios from "axios";

const API_BASE_URL = "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for error handling and automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // If 401 and we haven't already tried to refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token using the /auth/refresh endpoint
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject({
          ...error,
          message: "Session expired. Please login again.",
        });
      }
    }

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "An unexpected error occurred";

    return Promise.reject({ ...error, message });
  }
);
