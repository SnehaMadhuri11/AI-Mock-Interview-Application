import React, { useState, useEffect } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarsIcon from "@mui/icons-material/Stars";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ErrorIcon from "@mui/icons-material/Error";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6 text-center">
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="outlined" onClick={fetchStats} className="mt-4">
          Retry Loading
        </Button>
      </Box>
    );
  }

  const {
    totalInterviews = 0,
    averageScore = 0.0,
    bestScore = 0.0,
    strongAreas = [],
    weakAreas = [],
  } = stats || {};

  // Custom SVG rendering helper for circular score indicators
  const ScoreRing = ({ value, label, colorClass, shadowClass }) => {
    const radius = 50;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    // Cap score at 100%
    const normalizedVal = Math.min(Math.max(value, 0), 100);
    const strokeDashoffset = circumference - (normalizedVal / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Foreground progress ring */}
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              className={`stroke-current ${colorClass}`}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-bold text-slate-50 font-sans">
              {value.toFixed(0)}%
            </span>
          </div>
        </div>
        <span className="text-sm font-semibold text-slate-400 mt-3">{label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center md:text-left">
          <Typography variant="h4" className="font-bold text-slate-50 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
            Welcome to your Dashboard
          </Typography>
          <Typography variant="body1" className="text-slate-400 max-w-xl">
            Evaluate your skill gaps, practice tailored questions, and analyze your scores with our AI agents.
          </Typography>
        </div>
        <Button
          variant="contained"
          onClick={() => navigate("/interview/start")}
          className="bg-primary hover:bg-primary-dark font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 shrink-0"
        >
          Start Mock Interview <ArrowForwardIcon fontSize="small" />
        </Button>
      </motion.div>

      {/* Aggregate Score Indicators */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[220px]">
                <AssignmentTurnedInIcon className="text-primary text-5xl mb-3" />
                <Typography variant="h3" className="font-bold text-slate-50 mb-1">
                  {totalInterviews}
                </Typography>
                <Typography variant="body2" className="text-slate-400 font-medium">
                  Total Practice Interviews
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card">
              <CardContent className="flex justify-center items-center p-6 min-h-[220px]">
                <ScoreRing
                  value={averageScore}
                  label="Average Score"
                  colorClass="text-secondary"
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card">
              <CardContent className="flex justify-center items-center p-6 min-h-[220px]">
                <ScoreRing
                  value={bestScore}
                  label="Best Score"
                  colorClass="text-emerald-500"
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Strong & Weak Areas */}
      <Grid container spacing={4}>
        {/* Strong areas */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card h-full min-h-[300px]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
                  <VerifiedIcon className="text-emerald-500" />
                  <Typography variant="h6" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                    Strong Topics
                  </Typography>
                </div>
                {strongAreas && strongAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {strongAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
                    <StarsIcon className="text-4xl opacity-30 mb-2" />
                    <Typography variant="body2">
                      Complete more mock sessions to identify your key strengths.
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Weak areas */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass-card h-full min-h-[300px]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
                  <ErrorIcon className="text-rose-500" />
                  <Typography variant="h6" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                    Areas to Improve
                  </Typography>
                </div>
                {weakAreas && weakAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {weakAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 capitalize"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
                    <StarsIcon className="text-4xl opacity-30 mb-2" />
                    <Typography variant="body2">
                      No significant weaknesses detected yet! Keep practicing.
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* SVG Performance graph */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
              <TrendingUpIcon className="text-primary" />
              <Typography variant="h6" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                Score Trends Overview
              </Typography>
            </div>
            <div className="h-60 w-full relative">
              {totalInterviews > 0 ? (
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  
                  {/* Area Path */}
                  <path
                    d={`M 20 180 Q 120 ${180 - averageScore * 1.5} 250 ${180 - averageScore * 1.6} T 480 ${180 - bestScore * 1.6} L 480 180 L 20 180 Z`}
                    fill="url(#chartGrad)"
                  />
                  {/* Line Path */}
                  <path
                    d={`M 20 180 Q 120 ${180 - averageScore * 1.5} 250 ${180 - averageScore * 1.6} T 480 ${180 - bestScore * 1.6}`}
                    fill="transparent"
                    stroke="#06B6D4"
                    strokeWidth="3"
                  />
                  {/* Markers */}
                  <circle cx="20" cy="180" r="5" fill="#2563EB" stroke="#FFF" strokeWidth="1.5" />
                  <circle cx="250" cy={180 - averageScore * 1.6} r="6" fill="#06B6D4" stroke="#FFF" strokeWidth="1.5" />
                  <circle cx="480" cy={180 - bestScore * 1.6} r="6" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
                </svg>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-sm">
                  <span>Graph will display after completing mock sessions.</span>
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
              <span>First Interview</span>
              <span>Overall Average</span>
              <span>Best Score Peak</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
