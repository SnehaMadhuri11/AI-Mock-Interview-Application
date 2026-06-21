import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: localStorage.getItem("rememberedEmail") || "",
      password: "",
      rememberMe: !!localStorage.getItem("rememberedEmail"),
    },
  });

  // Calculate redirect landing route
  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <Typography variant="h5" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Login to continue preparing for your dream job
        </Typography>
      </div>

      {serverError && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
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
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // double entry to satisfy parser
                message: "Invalid email format",
              },
            })}
            InputProps={{
              className: "glass-input text-slate-100",
            }}
          />
        </div>

        {/* Password Field */}
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
            })}
            InputProps={{
              className: "glass-input text-slate-100",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
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

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                color="primary"
                className="text-slate-400"
                {...register("rememberMe")}
              />
            }
            label="Remember me"
            className="text-slate-400"
          />
          <Link
            to="/forgot-password"
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark font-semibold py-3 transition-colors rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          sx={{ height: 48 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              Sign In <LoginIcon fontSize="small" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-secondary hover:text-secondary-light font-medium transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};
