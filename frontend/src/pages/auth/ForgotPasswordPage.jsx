import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const response = await forgotPassword(data.email);
      if (response.success) {
        // Carry email forward to OTP screen
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err) {
      setServerError(err.message || "Failed to trigger recovery. Ensure email is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <Typography variant="h5" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          Forgot Password
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Enter your email to receive a verification OTP code
        </Typography>
      </div>

      {serverError && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email format",
              },
            })}
            InputProps={{
              className: "glass-input text-slate-100",
            }}
          />
        </div>

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark font-semibold py-3 transition-colors rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          sx={{ height: 48, mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              Send OTP <SendIcon fontSize="small" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowBackIcon fontSize="inherit" /> Back to Login
        </Link>
      </div>
    </div>
  );
};
