import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const VerifyOtpPage = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailParam = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: emailParam,
      otpCode: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      // actionType must be PASSWORD_RESET to verify password recovery codes in Spring Boot
      const response = await verifyOtp(data.email, data.otpCode);
      // Wait, the verifyOtp endpoint on Spring Boot is:
      // boolean isValid = authService.verifyOtp(request);
      // and returns ApiResponse.success("OTP verified successfully") if true
      if (response.success) {
        navigate(`/reset-password?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(data.otpCode)}`);
      }
    } catch (err) {
      setServerError(err.message || "Invalid or expired OTP. Please verify the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <Typography variant="h5" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          Verify OTP
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Enter the 6-digit verification code sent to your email inbox
        </Typography>
      </div>

      {serverError && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email - Hidden or disabled if loaded from query */}
        <div>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            disabled={!!emailParam}
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

        {/* OTP Code */}
        <div>
          <TextField
            fullWidth
            label="OTP Code"
            variant="outlined"
            placeholder="e.g. 123456"
            error={!!errors.otpCode}
            helperText={errors.otpCode?.message}
            {...register("otpCode", {
              required: "OTP code is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "OTP must be a 6-digit numeric code",
              },
            })}
            InputProps={{
              className: "glass-input text-slate-100 font-mono tracking-widest text-center text-lg",
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
              Verify Code <CheckCircleIcon fontSize="small" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center flex flex-col gap-2">
        <Link
          to="/forgot-password"
          className="text-xs text-secondary hover:text-secondary-light transition-colors"
        >
          Didn't receive code? Resend OTP
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowBackIcon fontSize="inherit" /> Back to Login
        </Link>
      </div>
    </div>
  );
};
