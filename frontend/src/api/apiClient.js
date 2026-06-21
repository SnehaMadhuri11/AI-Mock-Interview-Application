import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject JWT Access Token in the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 Unauthorized errors and perform token refresh
apiClient.interceptors.response.use(
  (response) => {
    // If the response is wrapped in our ApiResponse envelope, return the parsed data directly
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops if refresh token endpoint itself fails with 401
    if (originalRequest.url.includes("/api/auth/refresh-token")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      window.dispatchEvent(new Event("auth-expired"));
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Attempt token refresh via direct axios post to avoid looping the interceptor
          const refreshRes = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
            refreshToken: refreshToken,
          });

          const apiResponse = refreshRes.data;
          if (apiResponse.success && apiResponse.data) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken, role } = apiResponse.data;

            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            localStorage.setItem("userRole", role);

            // Re-apply authentication header and retry
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          // If refresh fails, purge authentication credentials and trigger redirect/logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userRole");
          window.dispatchEvent(new Event("auth-expired"));
          return Promise.reject(refreshErr);
        }
      }

      // No refresh token available, purge and expire auth session
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      window.dispatchEvent(new Event("auth-expired"));
    }

    // Wrap backend specific error response message if available
    const errorMsg = error.response?.data?.message || "An unexpected error occurred.";
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
export { API_BASE_URL };
