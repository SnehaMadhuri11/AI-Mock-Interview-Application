import React, { useState, useEffect, useRef } from "react";
import { chatbotApi } from "../../api/chatbotApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI Career Advisor. Ask me anything about technical preparations, learning roadmaps, resume enhancements, or interview tips!",
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userQuery = inputVal.trim();
    setInputVal("");
    
    // Add user message to history
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userQuery, timestamp: new Date() },
    ]);
    
    setLoading(true);
    try {
      const response = await chatbotApi.ask(userQuery);
      if (response.success && response.data) {
        let answerText = response.data.answer;
        try {
          const parsed = JSON.parse(answerText);
          if (parsed && typeof parsed === "object" && parsed.answer) {
            answerText = parsed.answer;
          }
        } catch (e) {
          // Not a JSON string, keep as is
        }
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: answerText, timestamp: new Date() },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: err.message || "Apologies, I encountered an issue. Please verify your connection.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto glass-card rounded-2xl border border-white/5 overflow-hidden">
      {/* Bot Chat Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-slate-950/20">
        <Avatar className="bg-primary/20 text-primary border border-primary/20">
          <SmartToyIcon />
        </Avatar>
        <div>
          <Typography variant="subtitle1" className="font-bold text-slate-100 font-sans">
            Career Advisor Agent
          </Typography>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Typography variant="caption" className="text-slate-400">
              Online and Ready
            </Typography>
          </div>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-grow overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <Avatar
              className={`border shrink-0 ${
                msg.sender === "user"
                  ? "bg-secondary/20 text-secondary border-secondary/20"
                  : "bg-primary/20 text-primary border-primary/20"
              }`}
              sx={{ width: 34, height: 34 }}
            >
              {msg.sender === "user" ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
            </Avatar>
            <div
              className={`p-4 rounded-2xl leading-relaxed text-sm ${
                msg.sender === "user"
                  ? "bg-primary text-slate-50 rounded-tr-none"
                  : "bg-slate-800/80 text-slate-100 border border-white/5 rounded-tl-none"
              }`}
            >
              <Typography variant="body2" className="whitespace-pre-line">
                {msg.text}
              </Typography>
              <span className={`text-[10px] block mt-2 text-right ${
                msg.sender === "user" ? "text-primary-light/80" : "text-slate-500"
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3 max-w-[80%] mr-auto">
            <Avatar className="bg-primary/20 text-primary border border-primary/20 shrink-0" sx={{ width: 34, height: 34 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <div className="bg-slate-800/80 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {/* Anchor element */}
        <div ref={scrollRef} />
      </div>

      {/* Input console */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-white/5 bg-slate-950/20 flex gap-3 items-center"
      >
        <TextField
          fullWidth
          placeholder="Ask about resume tips, Java MVC frameworks, system design roadmaps..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={loading}
          variant="outlined"
          size="small"
          InputProps={{
            className: "glass-input text-slate-100 py-1.5",
          }}
        />
        <IconButton
          type="submit"
          disabled={!inputVal.trim() || loading}
          className="bg-primary hover:bg-primary-dark disabled:bg-slate-800 disabled:text-slate-600 text-slate-50 w-11 h-11 rounded-xl transition-colors shrink-0 shadow-lg shadow-primary/20"
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </form>
    </div>
  );
};
