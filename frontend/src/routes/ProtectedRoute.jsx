import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box, Typography } from "@mui/material";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#0F172A",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Verifying security credentials...
          {/* Simple subtitle loading indicator */}
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the login page but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Role not authorized, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
