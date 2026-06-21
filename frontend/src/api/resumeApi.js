import apiClient from "./apiClient";

export const resumeApi = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getLatestAnalysis: () => {
    return apiClient.get("/api/resume/latest");
  },
};
