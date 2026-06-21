import apiClient from "./apiClient";

export const adminApi = {
  getUsers: () => {
    return apiClient.get("/api/admin/users");
  },

  getUserById: (id) => {
    return apiClient.get(`/api/admin/user/${id}`);
  },

  toggleUserStatus: (id, active) => {
    return apiClient.put(`/api/admin/user/${id}/status`, null, {
      params: { active },
    });
  },

  deleteUser: (id) => {
    return apiClient.delete(`/api/admin/user/${id}`);
  },

  getInterviews: () => {
    return apiClient.get("/api/admin/interviews");
  },

  getReports: () => {
    return apiClient.get("/api/admin/reports");
  },

  getDashboardStats: () => {
    return apiClient.get("/api/admin/dashboard");
  },
};
