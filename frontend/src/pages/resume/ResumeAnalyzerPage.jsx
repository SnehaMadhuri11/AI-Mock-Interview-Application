import React, { useState, useEffect } from "react";
import { resumeApi } from "../../api/resumeApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorIcon from "@mui/icons-material/Error";
import StarsIcon from "@mui/icons-material/Stars";
import TimelineIcon from "@mui/icons-material/Timeline";

export const ResumeAnalyzerPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const response = await resumeApi.getLatestAnalysis();
      if (response.success && response.data) {
        setAnalysis(response.data);
      }
    } catch (err) {
      console.warn("No previous resume analysis found or server unavailable", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        setError("Only PDF files are supported for ATS analysis.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Only PDF files are supported for ATS analysis.");
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const response = await resumeApi.uploadResume(file);
      if (response.success && response.data) {
        setAnalysis(response.data);
        setFile(null); // Clear selected file state
      }
    } catch (err) {
      setError(err.message || "Failed to analyze the resume. Verify server connection.");
    } finally {
      setUploading(false);
    }
  };

  // Helper to parse comma separated keywords safely
  const renderKeywords = (keywordString, type) => {
    if (!keywordString) return null;
    const list = keywordString
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const badgeClasses =
      type === "extracted"
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-rose-500/10 text-rose-400 border-rose-500/20";

    return (
      <div className="flex flex-wrap gap-2">
        {list.map((kw, i) => (
          <span
            key={i}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize ${badgeClasses}`}
          >
            {kw}
          </span>
        ))}
      </div>
    );
  };

  const getScoreColorClass = (score) => {
    if (score < 50) return "text-red-500";
    if (score < 75) return "text-amber-500";
    return "text-emerald-500";
  };

  const renderScoreGauge = (score) => {
    const radius = 60;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-40 h-40 flex items-center justify-center mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            className={`stroke-current ${getScoreColorClass(score)}`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <Typography variant="h3" className="font-bold text-slate-100">
            {score.toFixed(0)}
          </Typography>
          <Typography variant="caption" className="text-slate-500 uppercase tracking-widest font-bold">
            ATS Score
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Typography variant="h4" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          AI Resume Analyzer
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Upload your PDF resume to receive immediate ATS matching scores, key-skills audits, and optimization suggestions
        </Typography>
      </div>

      {error && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {error}
        </Alert>
      )}

      {/* Upload Zone & Results Grid */}
      <Grid container spacing={4}>
        {/* Upload Column */}
        <Grid item xs={12} md={5}>
          <Card className="glass-card h-full border border-white/5 flex flex-col justify-between">
            <CardContent className="p-6 flex-grow flex flex-col justify-center">
              <Typography variant="h6" className="font-bold text-slate-200 mb-4">
                Upload Resume (PDF)
              </Typography>

              {/* Drag and Drop Container */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 min-h-[220px] ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/10"
                }`}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center gap-3">
                  <CloudUploadIcon className="text-slate-400 text-5xl animate-bounce" />
                  <div>
                    <Typography variant="body2" className="font-semibold text-slate-300">
                      Drag & Drop or Click to browse
                    </Typography>
                    <Typography variant="caption" className="text-slate-500 block mt-1">
                      Supports PDF formats up to 10MB
                    </Typography>
                  </div>
                </label>
              </div>

              {/* Selected File Feedback */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <PictureAsPdfIcon className="text-red-400 shrink-0" />
                      <div className="overflow-hidden">
                        <Typography variant="body2" className="font-semibold text-slate-200 truncate">
                          {file.name}
                        </Typography>
                        <Typography variant="caption" className="text-slate-500 block">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      onClick={handleUploadSubmit}
                      disabled={uploading}
                      className="bg-primary hover:bg-primary-dark shrink-0"
                    >
                      {uploading ? <CircularProgress size={20} color="inherit" /> : "Analyze"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </Grid>

        {/* ATS Score Column */}
        <Grid item xs={12} md={7}>
          <Card className="glass-card h-full border border-white/5">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
              {loading ? (
                <CircularProgress color="primary" />
              ) : analysis ? (
                <div className="w-full text-center space-y-6">
                  {renderScoreGauge(analysis.atsScore)}
                  <Typography variant="body2" className="text-slate-400 max-w-md mx-auto">
                    Based on keyword parity algorithms, your resume currently has a{" "}
                    <span className="font-bold text-slate-200">
                      {analysis.atsScore.toFixed(0)}%
                    </span>{" "}
                    alignment with key candidate requirements. Check recommendations to improve your score.
                  </Typography>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-12 space-y-2">
                  <CloudUploadIcon className="text-5xl opacity-20" />
                  <Typography variant="body2">
                    No active resume analysis found. Upload a PDF resume above to start!
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analysis Breakdowns */}
      {analysis && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Extracted Skills */}
          <Card className="glass-card border border-white/5 h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <TaskAltIcon className="text-emerald-400" />
                <Typography variant="h6" className="font-bold text-slate-200 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                  Extracted Keywords & Skills
                </Typography>
              </div>
              <div className="py-2">
                {analysis.extractedSkills ? (
                  renderKeywords(analysis.extractedSkills, "extracted")
                ) : (
                  <Typography variant="body2" className="text-slate-500">
                    No keywords could be parsed from the uploaded document.
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Missing Skills */}
          <Card className="glass-card border border-white/5 h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <ErrorIcon className="text-rose-400" />
                <Typography variant="h6" className="font-bold text-slate-200 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                  Missing Keywords & Gaps
                </Typography>
              </div>
              <div className="py-2">
                {analysis.missingSkills ? (
                  renderKeywords(analysis.missingSkills, "missing")
                ) : (
                  <Typography variant="body2" className="text-slate-500">
                    No significant keyword gaps found. Great job!
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detailed recommendations */}
          <Card className="glass-card border border-white/5 md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <StarsIcon className="text-primary" />
                <Typography variant="h6" className="font-bold text-slate-200 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
                  AI Optimization Suggestions
                </Typography>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/20 p-4 rounded-xl border border-white/5">
                {analysis.recommendations || "No suggestions available."}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
