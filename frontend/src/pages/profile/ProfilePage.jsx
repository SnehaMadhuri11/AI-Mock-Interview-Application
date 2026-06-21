import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ShieldIcon from "@mui/icons-material/Shield";
import SaveIcon from "@mui/icons-material/Save";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      // Calls AuthContext's updateProfile which synchronises State and posts to backend
      const response = await updateProfile(data.fullName, data.phone, data.password);
      if (response.success) {
        setSuccessMsg("Profile details updated successfully!");
        reset({
          fullName: response.data.fullName,
          phone: response.data.phone,
          password: "",
        });
      }
    } catch (err) {
      setServerError(err.message || "Failed to update profile. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteOpen(false);
    setServerError("");
    setDeleting(true);
    try {
      const response = await authApi.deleteAccount();
      if (response.success) {
        logout();
        navigate("/login");
      }
    } catch (err) {
      setServerError(err.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <Typography variant="h4" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          Profile Settings
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Manage your personal details, credentials, and account settings
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

      {/* Account Info Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 h-full border border-white/5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl font-bold uppercase text-slate-50 shadow-md">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-slate-100 truncate max-w-[200px]">
                {user?.fullName}
              </Typography>
              <Typography variant="caption" className="text-slate-500 uppercase font-bold tracking-wider">
                {user?.role?.replace("ROLE_", "") || "USER"}
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={8}>
          <div className="glass-card rounded-xl p-6 h-full border border-white/5 space-y-4">
            <Typography variant="h6" className="font-bold text-slate-200 border-b border-white/5 pb-2">
              System Information
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <EmailIcon className="text-slate-500" />
                <div>
                  <Typography variant="caption" className="text-slate-500 block">Email Address</Typography>
                  <Typography variant="body2" className="text-slate-300 font-medium">{user?.email}</Typography>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldIcon className="text-slate-500" />
                <div>
                  <Typography variant="caption" className="text-slate-500 block">Verification Status</Typography>
                  <Typography variant="body2" className="text-emerald-400 font-medium">Verified Active</Typography>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Profile edit form */}
      <div className="glass-card rounded-xl p-6 border border-white/5">
        <Typography variant="h6" className="font-bold text-slate-200 border-b border-white/5 pb-2 mb-6">
          Edit Profile
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Grid container spacing={3}>
            {/* Full name */}
            <Grid item xs={12} md={6}>
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
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be exactly 10 digits",
                  },
                })}
                InputProps={{
                  className: "glass-input text-slate-100",
                }}
              />
            </Grid>

            {/* Password (Optional change) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Change Password (leave blank to keep current)"
                variant="outlined"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$|^$/,
                    message: "Password must contain a digit, upper, lower, and a special character",
                  },
                })}
                InputProps={{
                  className: "glass-input text-slate-100",
                }}
              />
            </Grid>
          </Grid>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <>
                  Save Changes <SaveIcon fontSize="small" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-xl p-6 border border-red-500/10 bg-red-950/5">
        <Typography variant="h6" className="font-bold text-red-400 border-b border-red-500/10 pb-2 mb-4">
          Danger Zone
        </Typography>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <Typography variant="body2" className="text-slate-300 font-semibold">
              Delete Account
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              Permanently purge your account, dashboard history, mock interviews, and resumes. This action is irreversible.
            </Typography>
          </div>
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteOpen(true)}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 shrink-0"
          >
            {deleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <>
                Delete Account <DeleteForeverIcon fontSize="small" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Deletion Warning Confirmation Modal */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1E293B",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle className="text-slate-100 font-bold font-sans">
          Confirm Account Deletion?
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-slate-400 text-sm">
            Are you absolutely sure you want to permanently delete your IntervAI profile?
            This will wipe out all your AI-evaluated scorecard metrics, transcripts, history, and uploaded PDF resumes. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 gap-2">
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            className="text-slate-400 border-slate-700 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            className="bg-red-600 hover:bg-red-700 font-semibold"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
