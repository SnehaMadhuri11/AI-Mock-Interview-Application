import React from "react";
import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";

export const AuthLayout = () => {
  return (
    <Box
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden bg-slate-900"
    >
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20 mb-3"
          >
            <TerminalIcon className="text-slate-50 font-bold" />
          </motion.div>
          
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography
              variant="h4"
              className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-400 font-sans"
              sx={{ fontFamily: "Outfit, Inter, sans-serif" }}
            >
              IntervAI
            </Typography>
            <Typography variant="body2" className="text-slate-400 mt-1">
              AI-Powered Mock Interview Platform
            </Typography>
          </motion.div>
        </div>

        {/* Content Outlet Wrapped in Glass Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card w-full rounded-2xl p-8 border border-white/5"
        >
          <Outlet />
        </motion.div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} IntervAI. All rights reserved.
        </div>
      </div>
    </Box>
  );
};
