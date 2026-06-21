import apiClient from "./apiClient";

export const authApi = {
  register: (fullName, email, phone, password) => {
    return apiClient.post("/api/auth/register", {
      fullName,
      email,
      phone,
      password,
    });
  },

  login: (email, password) => {
    return apiClient.post("/api/auth/login", {
      email,
      password,
    });
  },

  forgotPassword: (email) => {
    return apiClient.post("/api/auth/forgot-password", {
      email,
    });
  },

  verifyOtp: (email, otp) => {
    return apiClient.post("/api/auth/verify-otp", {
      email,
      otp,
    });
  },

  resetPassword: (email, otp, newPassword) => {
    return apiClient.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  },

  logout: () => {
    return apiClient.post("/api/auth/logout");
  },

  getProfile: () => {
    return apiClient.get("/api/user/profile");
  },

  updateProfile: (fullName, phone, password) => {
    const payload = { fullName, phone };
    if (password) {
      payload.password = password;
    }
    return apiClient.put("/api/user/profile", payload);
  },

  deleteAccount: () => {
    return apiClient.delete("/api/user/account");
  },
};
