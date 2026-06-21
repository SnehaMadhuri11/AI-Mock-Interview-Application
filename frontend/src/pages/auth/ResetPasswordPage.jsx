import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";

export const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const emailParam = searchParams.get("email") || "";
  const otpParam = searchParams.get("otp") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: emailParam,
      otpCode: otpParam,
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (emailParam) setValue("email", emailParam);
    if (otpParam) setValue("otpCode", otpParam);
  }, [emailParam, otpParam, setValue]);

  const newPasswordVal = watch("newPassword");

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const response = await resetPassword(data.email, data.otpCode, data.newPassword);
      if (response.success) {
        setSuccessMsg("Password reset successfully! Redirecting to login page...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setServerError(err.message || "Failed to reset password. Please ensure your OTP code is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <Typography variant="h5" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          Reset Password
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Create a strong new password for your account
        </Typography>
      </div>

      {serverError && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {serverError}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg">
          {successMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email - hidden/disabled */}
        <div>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            disabled={!!emailParam}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", { required: "Email is required" })}
            InputProps={{
              className: "glass-input text-slate-100",
            }}
          />
        </div>

        {/* OTP Code - hidden/disabled */}
        <div>
          <TextField
            fullWidth
            label="OTP Code"
            variant="outlined"
            disabled={!!otpParam}
            error={!!errors.otpCode}
            helperText={errors.otpCode?.message}
            {...register("otpCode", { required: "OTP code is required" })}
            InputProps={{
              className: "glass-input text-slate-100",
            }}
          />
        </div>

        {/* New Password */}
        <div>
          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/,
                message: "Must include a digit, upper, lower case letter, and a special character (@#$%^&+=!)",
              },
            })}
            InputProps={{
              className: "glass-input text-slate-100",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    className="text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <TextField
            fullWidth
            label="Confirm New Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === newPasswordVal || "Passwords do not match",
            })}
            InputProps={{
              className: "glass-input text-slate-100",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    className="text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
              Reset Password <LockResetIcon fontSize="small" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
