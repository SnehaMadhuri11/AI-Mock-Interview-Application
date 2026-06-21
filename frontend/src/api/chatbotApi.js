import apiClient from "./apiClient";

export const chatbotApi = {
  ask: (question) => {
    return apiClient.post("/api/chatbot/ask", {
      question,
    });
  },
};
