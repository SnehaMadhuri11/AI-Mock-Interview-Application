import apiClient from "./apiClient";

export const interviewApi = {
  startInterview: (category, difficulty, interviewType) => {
    return apiClient.post("/api/interview/start", {
      category,
      difficulty,
      interviewType,
    });
  },

  submitAnswer: (questionId, answer) => {
    return apiClient.post("/api/interview/submit-answer", {
      questionId,
      answer,
    });
  },

  getInterviewResult: (id) => {
    return apiClient.get(`/api/interview/result/${id}`);
  },

  getInterviewHistory: (page = 0, size = 10) => {
    return apiClient.get(`/api/interview/history`, {
      params: {
        page,
        size,
      },
    });
  },

  getInterviewReport: (id) => {
    return apiClient.get(`/api/interview/report/${id}`);
  },
};
