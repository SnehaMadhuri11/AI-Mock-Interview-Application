import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { interviewApi } from "../../api/interviewApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  LinearProgress,
  CircularProgress,
  Grid,
  Alert,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const QuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions || [];
  const category = location.state?.category || "Tech";

  const [activeIdx, setActiveIdx] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Redirect to start if questions are missing (e.g. direct url typing)
  useEffect(() => {
    if (questions.length === 0) {
      navigate("/interview/start");
    }
  }, [questions, navigate]);

  // Handle countdown timer
  useEffect(() => {
    if (questions.length === 0 || evaluation) return;

    setTimeLeft(120);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit when timer expires
          handleSubmitAnswer("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [activeIdx, evaluation, questions.length]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setAnswerText((prev) => prev + finalTranscript);
        }
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in this browser. Please use standard text input.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmitAnswer = async (forcedText) => {
    clearInterval(timerRef.current);
    if (isRecording) {
      recognitionRef.current?.stop();
    }

    const finalAnswer = forcedText !== undefined ? forcedText : answerText;
    if (!finalAnswer.trim()) {
      setError("Please write or speak an answer before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const activeQuestion = questions[activeIdx];
      const response = await interviewApi.submitAnswer(activeQuestion.id, finalAnswer);
      if (response.success && response.data) {
        setEvaluation(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to submit answer. Check server connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextOrCompile = async () => {
    // Check if this was the last question
    if (activeIdx >= questions.length - 1) {
      setSubmitting(true);
      try {
        // Query the latest history to find the active interview ID
        const historyRes = await interviewApi.getInterviewHistory(0, 1);
        if (historyRes.success && historyRes.data && historyRes.data.content?.length > 0) {
          const activeInterviewId = historyRes.data.content[0].id;
          navigate(`/interview/result/${activeInterviewId}`);
        } else {
          // Fallback to dashboard if unable to compile
          navigate("/dashboard");
        }
      } catch (err) {
        setError("Compilation failed. Redirecting to history.");
        setTimeout(() => navigate("/interview/history"), 2000);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Clear evaluation states and step to next index
      setEvaluation(null);
      setAnswerText("");
      setError("");
      setActiveIdx((prev) => prev + 1);
    }
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[activeIdx];
  const progressPercent = ((activeIdx + 1) / questions.length) * 100;

  // Format timer displays
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <Typography variant="body2" className="font-semibold text-slate-300">
          Topic: <span className="text-secondary">{category}</span>
        </Typography>
        <Typography variant="body2" className="font-semibold text-slate-300">
          Question {activeIdx + 1} of {questions.length}
        </Typography>
      </div>

      <LinearProgress
        variant="determinate"
        value={progressPercent}
        className="rounded-full bg-slate-800"
        sx={{
          height: 6,
          "& .MuiLinearProgress-bar": {
            backgroundImage: "linear-gradient(to right, #2563EB, #06B6D4)",
          },
        }}
      />

      <Grid container spacing={4}>
        {/* Question Panel */}
        <Grid item xs={12} md={7}>
          <Card className="glass-card border border-white/5 shadow-2xl h-full flex flex-col justify-between min-h-[350px]">
            <CardContent className="p-6 space-y-6 flex-grow flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {currentQuestion.difficulty || "STANDARD"}
                </span>
                <Typography variant="h5" className="font-bold text-slate-100 font-sans mt-4 leading-relaxed">
                  {currentQuestion.questionText}
                </Typography>
              </div>

              {/* Text answer or evaluation results displays */}
              {!evaluation ? (
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Type your response here, or click the mic button to speak your answer aloud..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    disabled={submitting}
                    InputProps={{
                      className: "glass-input text-slate-100 py-3",
                    }}
                  />
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="contained"
                      color={isRecording ? "error" : "secondary"}
                      onClick={toggleRecording}
                      disabled={submitting}
                      startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                      className={`font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${
                        isRecording ? "bg-rose-600 hover:bg-rose-700 animate-pulse" : "bg-secondary hover:bg-secondary-dark text-slate-900"
                      }`}
                    >
                      {isRecording ? "Recording..." : "Record Voice"}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmitAnswer()}
                      disabled={submitting || !answerText.trim()}
                      endIcon={<SendIcon />}
                      className="bg-primary hover:bg-primary-dark font-semibold px-5 py-2.5 rounded-lg"
                    >
                      {submitting ? <CircularProgress size={20} color="inherit" /> : "Submit Response"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <Alert severity="success" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                    AI response evaluated and recorded!
                  </Alert>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleNextOrCompile}
                    className="bg-gradient-to-r from-primary to-secondary font-bold py-3 rounded-lg shadow-lg"
                  >
                    {activeIdx >= questions.length - 1 ? "Compile Final Results" : "Proceed to Next Question"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Live Side Feedback Panel */}
        <Grid item xs={12} md={5}>
          <Card className="glass-card border border-white/5 h-full min-h-[350px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              {!evaluation ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <AccessTimeIcon className="text-6xl text-primary animate-pulse-slow" />
                  <div>
                    <Typography variant="h4" className="font-bold text-slate-200">
                      {formatTime(timeLeft)}
                    </Typography>
                    <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider block mt-1">
                      Time Remaining
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-slate-400 max-w-[240px]">
                    Answer within the timer. Leaving the text area blank will submit a null score.
                  </Typography>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <Typography variant="h6" className="font-bold text-slate-100 font-sans">
                      AI Feedback Breakdown
                    </Typography>
                  </div>

                  {/* Scores progress bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-400">Technical Accuracy</span>
                        <span className="text-primary">{evaluation.technicalScore.toFixed(0)}%</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={evaluation.technicalScore}
                        className="bg-slate-800 rounded-full h-1.5"
                        sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#2563EB" } }}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-400">Communication Delivery</span>
                        <span className="text-secondary">{evaluation.communicationScore.toFixed(0)}%</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={evaluation.communicationScore}
                        className="bg-slate-800 rounded-full h-1.5"
                        sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#06B6D4" } }}
                      />
                    </div>
                  </div>

                  {/* Suggestions list */}
                  <div className="space-y-3">
                    <div>
                      <Typography variant="caption" className="text-slate-500 font-bold uppercase">Clarity & Feedback</Typography>
                      <Typography variant="body2" className="text-slate-300 bg-slate-950/20 p-3 rounded-lg border border-white/5 text-xs leading-relaxed">
                        {evaluation.feedback}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" className="text-slate-500 font-bold uppercase">Key Improvement Tips</Typography>
                      <Typography variant="body2" className="text-slate-300 bg-slate-950/20 p-3 rounded-lg border border-white/5 text-xs leading-relaxed">
                        {evaluation.suggestions}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
