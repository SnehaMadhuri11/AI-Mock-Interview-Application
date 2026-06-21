import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./utils/theme";

// Auth Context
import { AuthProvider } from "./context/AuthContext";

// Guards & Layouts
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { VerifyOtpPage } from "./pages/auth/VerifyOtpPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

// Main Pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { StartInterviewPage } from "./pages/interview/StartInterviewPage";
import { QuestionPage } from "./pages/interview/QuestionPage";
import { ResultPage } from "./pages/interview/ResultPage";
import { HistoryPage } from "./pages/interview/HistoryPage";
import { ResumeAnalyzerPage } from "./pages/resume/ResumeAnalyzerPage";
import { CareerGuidancePage } from "./pages/career/CareerGuidancePage";
import { ChatbotPage } from "./pages/chatbot/ChatbotPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { AdminPage } from "./pages/admin/AdminPage";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Guest/Authentication Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Authenticated Dashboard Core Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Interview Flow */}
              <Route path="/interview/start" element={<StartInterviewPage />} />
              <Route path="/interview/question" element={<QuestionPage />} />
              <Route path="/interview/result/:id" element={<ResultPage />} />
              <Route path="/interview/history" element={<HistoryPage />} />
              
              {/* Other Features */}
              <Route path="/resume" element={<ResumeAnalyzerPage />} />
              <Route path="/career" element={<CareerGuidancePage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Administrative Control Portal (Restricted to ADMIN role) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all Fallback Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
