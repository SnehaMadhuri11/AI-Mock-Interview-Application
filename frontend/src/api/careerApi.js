import apiClient from "./apiClient";

export const careerApi = {
  getRecommendations: () => {
    return apiClient.get("/api/career/recommendations");
  },
};
