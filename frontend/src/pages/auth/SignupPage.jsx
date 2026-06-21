import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import HowToRegIcon from "@mui/icons-material/HowToReg";

export const SignupPage = () => {
  const { register: signupUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const response = await signupUser(
        data.fullName,
        data.email,
        data.phone,
        data.password
      );
      if (response.success) {
        setSuccessMsg("Account registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setServerError(err.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <Typography variant="h5" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          Create Account
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Register to start taking AI-guided mock tests
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
        {/* Full Name */}
        <div>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            {...register("fullName", {
              required: "Full name is required",
              maxLength: {
                value: 100,
                message: "Name must be less than 100 characters",
              },
            })}
            InputProps={{
              className: "glass-input text-slate-100",
            }}
          />
        </div>

        {/* Email Address */}
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

        {/* Phone Number */}
        <div>
          <TextField
            fullWidth
            label="Phone Number (10 digits)"
            variant="outlined"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be exactly 10 digits (e.g. 9876543210)",
              },
            })}
            InputProps={{
              className: "glass-input text-slate-100",
            }}
          />
        </div>

        {/* Password */}
        <div>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Password is required",
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
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === passwordVal || "Passwords do not match",
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
              Register Account <HowToRegIcon fontSize="small" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-secondary hover:text-secondary-light font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
