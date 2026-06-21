import apiClient from "./apiClient";

export const dashboardApi = {
  getStats: () => {
    return apiClient.get("/api/dashboard/stats");
  },
};
