import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

export const AdminPage = () => {
  const [tabVal, setTabVal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [reports, setReports] = useState([]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Load general system analytics metrics
      const statsRes = await adminApi.getDashboardStats();
      if (statsRes.success) setStats(statsRes.data);

      // Load user profile details list
      const usersRes = await adminApi.getUsers();
      if (usersRes.success) setUsers(usersRes.data);

      // Load completed interviews lists
      const interviewsRes = await adminApi.getInterviews();
      if (interviewsRes.success) setInterviews(interviewsRes.data);

      // Load score reports scorecards list
      const reportsRes = await adminApi.getReports();
      if (reportsRes.success) setReports(reportsRes.data);
    } catch (err) {
      setError(err.message || "Failed to load administrative records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTabChange = (e, newValue) => {
    setTabVal(newValue);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      const response = await adminApi.toggleUserStatus(userId, updatedStatus);
      if (response.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, active: updatedStatus } : u))
        );
      }
    } catch (err) {
      setError("Failed to update user block/unblock status. " + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this user account?")) {
      return;
    }
    try {
      const response = await adminApi.deleteUser(userId);
      if (response.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      setError("Failed to delete user account. " + err.message);
    }
  };

  if (loading && !stats) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h4" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
            Admin Control Panel
          </Typography>
          <Typography variant="body2" className="text-slate-400 mt-1">
            Global system audits, user management, and mock interview score tracking.
          </Typography>
        </div>
        <Button
          variant="outlined"
          onClick={loadDashboardData}
          startIcon={<RefreshIcon />}
          className="border-slate-700 text-slate-300 hover:bg-slate-800 self-start"
        >
          Sync Records
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {error}
        </Alert>
      )}

      {/* Overview Cards */}
      {stats && (
        <Grid container spacing={4}>
          <Grid item xs={6} md={2.4}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <Typography variant="caption" className="text-slate-500 block font-bold uppercase tracking-wider">Total Users</Typography>
                <Typography variant="h4" className="font-bold text-slate-100 mt-1">{stats.totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <Typography variant="caption" className="text-slate-500 block font-bold uppercase tracking-wider">Active Users</Typography>
                <Typography variant="h4" className="font-bold text-emerald-400 mt-1">{stats.activeUsersCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <Typography variant="caption" className="text-slate-500 block font-bold uppercase tracking-wider">Interviews</Typography>
                <Typography variant="h4" className="font-bold text-primary mt-1">{stats.totalInterviews}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <Typography variant="caption" className="text-slate-500 block font-bold uppercase tracking-wider">Resumes Scanned</Typography>
                <Typography variant="h4" className="font-bold text-secondary mt-1">{stats.totalResumeAnalyses}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <Typography variant="caption" className="text-slate-500 block font-bold uppercase tracking-wider">Avg Score Rate</Typography>
                <Typography variant="h4" className="font-bold text-amber-500 mt-1">{stats.averageInterviewScore.toFixed(1)}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs list */}
      <Box className="border-b border-white/5">
        <Tabs
          value={tabVal}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          className="text-slate-300"
        >
          <Tab label="Users Directory" icon={<SupervisedUserCircleIcon />} iconPosition="start" />
          <Tab label="System Interviews" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Scorecard Audits" icon={<ReceiptLongIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <div>
        {/* Tab 0: Users */}
        {tabVal === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TableContainer component={Paper} className="bg-slate-800/40 border border-white/5 rounded-xl overflow-hidden">
              <Table>
                <TableHead className="bg-slate-950/20">
                  <TableRow>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">ID</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Full Name</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Email</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Phone</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Role</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Status</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5 text-right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-800/20 transition-colors">
                        <TableCell className="text-slate-300 border-b border-white/5 font-mono">{row.id}</TableCell>
                        <TableCell className="text-slate-200 border-b border-white/5 font-semibold">{row.fullName}</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5">{row.email}</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5">{row.phone}</TableCell>
                        <TableCell className="border-b border-white/5">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.role === 'ROLE_ADMIN' || row.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                            {row.role?.replace("ROLE_", "")}
                          </span>
                        </TableCell>
                        <TableCell className="border-b border-white/5">
                          <Switch
                            size="small"
                            color="success"
                            checked={row.active}
                            onChange={() => handleStatusToggle(row.id, row.active)}
                            disabled={row.role === "ADMIN" || row.role === "ROLE_ADMIN"}
                          />
                          <span className={`text-xs ml-1 font-medium ${row.active ? "text-emerald-400" : "text-rose-400"}`}>
                            {row.active ? "Active" : "Blocked"}
                          </span>
                        </TableCell>
                        <TableCell className="border-b border-white/5 text-right">
                          <IconButton
                            disabled={row.role === "ADMIN" || row.role === "ROLE_ADMIN"}
                            onClick={() => handleDeleteUser(row.id)}
                            className="text-slate-500 hover:text-rose-400 disabled:opacity-30"
                          >
                            <DeleteIcon size="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500 py-8 border-b border-white/5">
                        No registered candidates found in the system database.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}

        {/* Tab 1: Interviews */}
        {tabVal === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TableContainer component={Paper} className="bg-slate-800/40 border border-white/5 rounded-xl overflow-hidden">
              <Table>
                <TableHead className="bg-slate-950/20">
                  <TableRow>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">ID</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Candidate Email</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Topic</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Type</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Difficulty</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Completed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {interviews.length > 0 ? (
                    interviews.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-800/20 transition-colors">
                        <TableCell className="text-slate-300 border-b border-white/5 font-mono">{row.id}</TableCell>
                        <TableCell className="text-slate-200 border-b border-white/5 font-semibold">{row.userEmail || "anonymous@email.com"}</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5 capitalize">{row.category}</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5 capitalize">{row.interviewType?.toLowerCase()}</TableCell>
                        <TableCell className="border-b border-white/5">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                            row.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            row.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {row.difficulty}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-400 border-b border-white/5 text-xs">
                          {new Date(row.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8 border-b border-white/5">
                        No completed platform mock sessions audited.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}

        {/* Tab 2: Reports */}
        {tabVal === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TableContainer component={Paper} className="bg-slate-800/40 border border-white/5 rounded-xl overflow-hidden">
              <Table>
                <TableHead className="bg-slate-950/20">
                  <TableRow>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Report ID</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Session ID</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Technical Score</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Communication</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Confidence</TableCell>
                    <TableCell className="text-slate-400 font-bold border-b border-white/5">Overall Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.length > 0 ? (
                    reports.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-800/20 transition-colors">
                        <TableCell className="text-slate-300 border-b border-white/5 font-mono">{row.id}</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5 font-mono">{row.interviewId}</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5">{row.technicalScore.toFixed(0)}%</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5">{row.communicationScore.toFixed(0)}%</TableCell>
                        <TableCell className="text-slate-300 border-b border-white/5">{row.confidenceScore.toFixed(0)}%</TableCell>
                        <TableCell className="border-b border-white/5 font-bold text-slate-200">
                          {row.overallScore.toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8 border-b border-white/5">
                        No candidate evaluation report scorecards found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};
