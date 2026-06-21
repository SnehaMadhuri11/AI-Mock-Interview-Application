import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { interviewApi } from "../../api/interviewApi";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ErrorIcon from "@mui/icons-material/Error";
import StarsIcon from "@mui/icons-material/Stars";

export const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError("");
      // Calls interviewResult which compiles results
      const response = await interviewApi.getInterviewResult(id);
      if (response.success && response.data) {
        setResult(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to compile mock results. Check server connectivity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return (
      <Box className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <CircularProgress color="primary" />
        <Typography variant="body2" className="text-slate-400 animate-pulse">
          Analyzing transcript and compiling AI scorecards...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6 text-center">
        <Typography color="error" className="mb-4">
          {error}
        </Typography>
        <Button variant="outlined" onClick={fetchResult} startIcon={<ArrowBackIcon />}>
          Retry compilation
        </Button>
      </Box>
    );
  }

  const {
    overallScore = 0.0,
    technicalScore = 0.0,
    communicationScore = 0.0,
    confidenceScore = 0.0,
    feedback = "",
    strengths = "",
    weaknesses = "",
  } = result || {};

  // Custom visual radial gauge for overall summary
  const renderOverallGauge = (score) => {
    const radius = 70;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#scoreGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <Typography variant="h2" className="font-extrabold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
            {score.toFixed(0)}%
          </Typography>
          <Typography variant="caption" className="text-slate-400 uppercase tracking-widest font-bold block mt-1">
            Overall Rating
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h4" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
            Interview Score Report
          </Typography>
          <Typography variant="body2" className="text-slate-400 mt-1">
            Granular evaluation analytics compiled across multiple indicators by AI
          </Typography>
        </div>
        <Button
          variant="outlined"
          onClick={() => navigate("/interview/history")}
          startIcon={<ArrowBackIcon />}
          className="border-slate-700 text-slate-300 hover:bg-slate-800 self-start"
        >
          Back to History
        </Button>
      </div>

      <Grid container spacing={4}>
        {/* Overall Score Circle Card */}
        <Grid item xs={12} md={4}>
          <Card className="glass-card h-full border border-white/5 flex flex-col justify-center py-8">
            <CardContent className="p-6 text-center space-y-6">
              {renderOverallGauge(overallScore)}
              <div>
                <Typography variant="body2" className="text-slate-400">
                  Congratulations on completing your session! Check details to close skill gaps.
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Breakdown Card */}
        <Grid item xs={12} md={8}>
          <Card className="glass-card h-full border border-white/5">
            <CardContent className="p-6 space-y-6">
              <Typography variant="h6" className="font-bold text-slate-200 border-b border-white/5 pb-2">
                Evaluated Metrics Breakdown
              </Typography>

              <div className="space-y-5">
                {/* Technical Accuracy */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-400">Technical Competence & Code Accuracy</span>
                    <span className="text-primary font-mono">{technicalScore.toFixed(0)}%</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={technicalScore}
                    className="bg-slate-800 rounded-full h-2.5"
                    sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#2563EB" } }}
                  />
                  <Typography variant="caption" className="text-slate-500 block mt-1 leading-relaxed">
                    Evaluates accuracy of MVC flows, DSA queries, React compilers, or syntax definitions.
                  </Typography>
                </div>

                {/* Communication Delivery */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-400">Communication & Grammar Delivery</span>
                    <span className="text-secondary font-mono">{communicationScore.toFixed(0)}%</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={communicationScore}
                    className="bg-slate-800 rounded-full h-2.5"
                    sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#06B6D4" } }}
                  />
                  <Typography variant="caption" className="text-slate-500 block mt-1 leading-relaxed">
                    Evaluates structural coherence, brevity of descriptions, and fluency parameters.
                  </Typography>
                </div>

                {/* Confidence Level */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-400">Confidence & Clarity Score</span>
                    <span className="text-emerald-400 font-mono">{confidenceScore.toFixed(0)}%</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={confidenceScore}
                    className="bg-slate-800 rounded-full h-2.5"
                    sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#10B981" } }}
                  />
                  <Typography variant="caption" className="text-slate-500 block mt-1 leading-relaxed">
                    Evaluates vocal clarity, tone variations, and confidence ratios from voice inputs.
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Text Card Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths Card */}
        <Card className="glass-card border border-white/5 h-full">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5">
              <ThumbUpAltIcon className="text-emerald-400" />
              <Typography variant="h6" className="font-bold text-slate-200 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                Identified Strengths
              </Typography>
            </div>
            <Typography variant="body2" className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/20 p-4 rounded-xl border border-white/5">
              {strengths || "Analyzing transcripts..."}
            </Typography>
          </CardContent>
        </Card>

        {/* Weaknesses Card */}
        <Card className="glass-card border border-white/5 h-full">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5">
              <ErrorIcon className="text-rose-400" />
              <Typography variant="h6" className="font-bold text-slate-200 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                Identified Weaknesses
              </Typography>
            </div>
            <Typography variant="body2" className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/20 p-4 rounded-xl border border-white/5">
              {weaknesses || "Analyzing transcripts..."}
            </Typography>
          </CardContent>
        </Card>

        {/* Detailed AI Suggestions */}
        <Card className="glass-card border border-white/5 md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5">
              <StarsIcon className="text-primary" />
              <Typography variant="h6" className="font-bold text-slate-200 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                AI Recommendations Roadmap
              </Typography>
            </div>
            <Typography variant="body2" className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/20 p-4 rounded-xl border border-white/5">
              {feedback || "Detailed suggestions will populate here."}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
