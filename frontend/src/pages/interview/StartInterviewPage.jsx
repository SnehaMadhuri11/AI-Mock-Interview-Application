import React, { useState } from "react";
import { interviewApi } from "../../api/interviewApi";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Grid,
  Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";

export const StartInterviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const categories = [
    { value: "Java", label: "Java Development" },
    { value: "Spring Boot", label: "Spring Boot Framework" },
    { value: "Python", label: "Python & Backend" },
    { value: "SQL", label: "SQL & Databases" },
    { value: "React", label: "React Frontend" },
    { value: "DSA", label: "Data Structures & Algorithms" },
    { value: "Machine Learning", label: "Machine Learning / AI" },
    { value: "HR", label: "Human Resources (HR)" },
  ];

  const difficulties = [
    { value: "EASY", label: "Easy" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HARD", label: "Hard" },
  ];

  const interviewTypes = [
    { value: "TECHNICAL", label: "Technical Interview" },
    { value: "HR", label: "HR / Fit Check" },
    { value: "BEHAVIORAL", label: "Behavioral Round" },
    { value: "SYSTEM_DESIGN", label: "System Design" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
      difficulty: "",
      interviewType: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await interviewApi.startInterview(
        data.category,
        data.difficulty,
        data.interviewType
      );

      if (response.success && response.data) {
        // Direct the user to the question page passing the questions array
        navigate("/interview/question", {
          state: {
            questions: response.data,
            category: data.category,
          },
        });
      }
    } catch (err) {
      setServerError(err.message || "Failed to start interview. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <Typography variant="h4" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          AI Mock Interview Setup
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Select your desired topics, difficulty tier, and interview focus areas. Our AI agents will curate custom questions for you.
        </Typography>
      </div>

      {serverError && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {serverError}
        </Alert>
      )}

      <Card className="glass-card border border-white/5 shadow-2xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Grid container spacing={3}>
              {/* Category */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel id="category-select-label" className="text-slate-400">Category Selection</InputLabel>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        labelId="category-select-label"
                        label="Category Selection"
                        className="glass-input text-slate-100 rounded-lg"
                        {...field}
                      >
                        {categories.map((c) => (
                          <MenuItem key={c.value} value={c.value}>
                            {c.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Difficulty */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.difficulty}>
                  <InputLabel id="difficulty-select-label" className="text-slate-400">Difficulty Tier</InputLabel>
                  <Controller
                    name="difficulty"
                    control={control}
                    rules={{ required: "Difficulty is required" }}
                    render={({ field }) => (
                      <Select
                        labelId="difficulty-select-label"
                        label="Difficulty Tier"
                        className="glass-input text-slate-100 rounded-lg"
                        {...field}
                      >
                        {difficulties.map((d) => (
                          <MenuItem key={d.value} value={d.value}>
                            {d.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.difficulty && (
                    <FormHelperText>{errors.difficulty.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Interview Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.interviewType}>
                  <InputLabel id="type-select-label" className="text-slate-400">Interview Type</InputLabel>
                  <Controller
                    name="interviewType"
                    control={control}
                    rules={{ required: "Interview type is required" }}
                    render={({ field }) => (
                      <Select
                        labelId="type-select-label"
                        label="Interview Type"
                        className="glass-input text-slate-100 rounded-lg"
                        {...field}
                      >
                        {interviewTypes.map((t) => (
                          <MenuItem key={t.value} value={t.value}>
                            {t.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.interviewType && (
                    <FormHelperText>{errors.interviewType.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Launch Button */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark font-semibold py-3 transition-colors rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              sx={{ height: 48, mt: 4 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  Launch AI Session <ArrowForwardIcon fontSize="small" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
