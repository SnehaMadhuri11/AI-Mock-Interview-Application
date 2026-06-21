import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionIcon from "@mui/icons-material/Description";
import TimelineIcon from "@mui/icons-material/Timeline";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TerminalIcon from "@mui/icons-material/Terminal";

const DRAWER_WIDTH = 260;

export const MainLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard Stats";
    if (path.includes("/interview/start")) return "AI Interview Setup";
    if (path.includes("/interview/question")) return "Active Interview Session";
    if (path.includes("/interview/result")) return "Interview Score Report";
    if (path.includes("/interview/history")) return "Interview History";
    if (path.includes("/resume")) return "AI Resume Analyzer";
    if (path.includes("/career")) return "AI Career Advisor";
    if (path.includes("/chatbot")) return "AI Assistant Chat";
    if (path.includes("/profile")) return "Profile Settings";
    if (path.includes("/admin")) return "Administrative Portal";
    return "IntervAI";
  };

  const navigationItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Start Interview", path: "/interview/start", icon: <VideoCallIcon /> },
    { text: "History", path: "/interview/history", icon: <HistoryIcon /> },
    { text: "Resume Analyzer", path: "/resume", icon: <DescriptionIcon /> },
    { text: "Career Advisor", path: "/career", icon: <TimelineIcon /> },
    { text: "AI Chatbot", path: "/chatbot", icon: <ChatIcon /> },
    { text: "Profile Settings", path: "/profile", icon: <AccountCircleIcon /> },
  ];

  // Dynamically append Admin Portal link if the authenticated role is ADMIN
  if (role === "ADMIN") {
    navigationItems.push({
      text: "Admin Panel",
      path: "/admin",
      icon: <AdminPanelSettingsIcon />,
    });
  }

  const drawerContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-white/5 text-slate-100">
      {/* Sidebar Header Branding */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary shadow-md shadow-primary/20">
            <TerminalIcon className="text-slate-50 font-bold scale-90" />
          </div>
          <Typography
            variant="h6"
            className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-300 font-sans"
            sx={{ fontFamily: "Outfit, Inter, sans-serif" }}
          >
            IntervAI
          </Typography>
        </div>
        <IconButton
          onClick={handleDrawerToggle}
          className="md:hidden text-slate-400 hover:text-white"
        >
          <ChevronLeftIcon />
        </IconButton>
      </div>

      {/* Navigation List */}
      <List className="flex-grow px-3 py-4 space-y-1">
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-l-4 border-transparent"
                }`
              }
              sx={{
                "&.active .MuiListItemIcon-root": { color: "#2563EB" },
                "&:hover .MuiListItemIcon-root": { color: "#F8FAFC" },
              }}
            >
              <ListItemIcon className="text-slate-400 min-w-[36px] group-hover:text-slate-100 transition-colors">
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Sidebar Footer User Summary */}
      <div className="p-4 border-t border-white/5 bg-slate-950/20">
        <div className="flex items-center gap-3">
          <Avatar
            className="bg-primary/20 text-primary uppercase font-bold"
            sx={{ width: 38, height: 38 }}
          >
            {user?.fullName?.charAt(0) || "U"}
          </Avatar>
          <div className="flex-grow overflow-hidden">
            <Typography variant="body2" className="font-semibold text-slate-200 truncate">
              {user?.fullName || "Candidate User"}
            </Typography>
            <Typography variant="caption" className="text-slate-500 block truncate">
              {user?.email || "candidate@email.com"}
            </Typography>
          </div>
          <IconButton onClick={handleLogoutClick} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
            <LogoutIcon size="small" />
          </IconButton>
        </div>
      </div>
    </div>
  );

  return (
    <Box className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        className="glass-panel"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          bgcolor: "rgba(15, 23, 42, 0.7)",
        }}
      >
        <Toolbar className="flex justify-between px-6">
          <div className="flex items-center gap-3">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
              className="text-slate-100"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-300 hidden sm:block font-sans"
              sx={{ fontFamily: "Outfit, Inter, sans-serif" }}
            >
              {getPageTitle()}
            </Typography>
          </div>

          {/* Profile Dropdown Toggler */}
          <div className="flex items-center gap-4">
            {role === "ADMIN" && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                ADMIN
              </span>
            )}
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                className="bg-secondary/20 text-secondary uppercase font-semibold border border-secondary/20 hover:scale-105 transition-transform"
                sx={{ width: 36, height: 36 }}
              >
                {user?.fullName?.charAt(0) || "U"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  bgcolor: "#1E293B",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  width: 200,
                  mt: 1.5,
                  "& .MuiMenuItem-root": {
                    py: 1.5,
                    px: 2,
                    fontSize: "0.9rem",
                    color: "#94A3B8",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.04)",
                      color: "#F8FAFC",
                    },
                  },
                },
              }}
            >
              <div className="px-4 py-2">
                <Typography variant="subtitle2" className="text-slate-200 font-semibold truncate">
                  {user?.fullName}
                </Typography>
                <Typography variant="caption" className="text-slate-400 block truncate">
                  {user?.email}
                </Typography>
              </div>
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
              <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
                <AccountCircleIcon className="mr-2 text-slate-400 scale-90" /> Profile Settings
              </MenuItem>
              {role === "ADMIN" && (
                <MenuItem onClick={() => { handleMenuClose(); navigate("/admin"); }}>
                  <AdminPanelSettingsIcon className="mr-2 text-slate-400 scale-90" /> Admin Panel
                </MenuItem>
              )}
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
              <MenuItem onClick={handleLogoutClick} className="text-red-400 hover:text-red-300">
                <LogoutIcon className="mr-2 scale-90 text-red-400" /> Logout Session
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer navigation container - Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="navigation panels"
      >
        {/* Temporary Drawer for responsive mobile sizes */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH, bgcolor: "#0F172A", borderRight: "none" },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Permanent Sidebar for medium and wider monitors */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH, border: "none" },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Canvas container for primary page components */}
      <Box
        component="main"
        className="flex-grow min-h-screen pt-20 px-6 pb-12 w-[calc(100%-260px)]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};
