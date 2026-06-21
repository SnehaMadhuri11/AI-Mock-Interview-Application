import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user profile if token exists on initialization
  const loadUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        // Ensure role is synchronised
        localStorage.setItem("userRole", response.data.role);
      } else {
        clearAuth();
      }
    } catch (err) {
      console.error("Failed to load user profile on startup", err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();

    // Listen for custom token expiration events dispatched from Axios Client
    const handleAuthExpired = () => {
      clearAuth();
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data) {
        const { accessToken, refreshToken, role } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userRole", role);
        setIsAuthenticated(true);
        
        // Load the full profile details immediately after successful login
        const profileRes = await authApi.getProfile();
        if (profileRes.success && profileRes.data) {
          setUser(profileRes.data);
        }
        return response;
      }
      throw new Error(response.message || "Invalid credentials");
    } catch (error) {
      clearAuth();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, phone, password) => {
    return await authApi.register(fullName, email, phone, password);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Logout request to backend failed or token was already invalid", err);
    } finally {
      clearAuth();
      setLoading(false);
    }
  };

  const updateProfile = async (fullName, phone, password) => {
    try {
      const response = await authApi.updateProfile(fullName, phone, password);
      if (response.success && response.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    return await authApi.forgotPassword(email);
  };

  const verifyOtp = async (email, otp) => {
    return await authApi.verifyOtp(email, otp);
  };

  const resetPassword = async (email, otp, newPassword) => {
    return await authApi.resetPassword(email, otp, newPassword);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    role: user?.role || localStorage.getItem("userRole"),
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    verifyOtp,
    resetPassword,
    reloadProfile: loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
