import React, { useState, useEffect } from "react";
import { interviewApi } from "../../api/interviewApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
  TablePagination,
  Alert,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination & Search States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await interviewApi.getInterviewHistory(page, rowsPerPage);
      if (response.success && response.data) {
        setHistory(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to load interview history logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, rowsPerPage]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.category?.toLowerCase().includes(query) ||
      item.difficulty?.toLowerCase().includes(query) ||
      item.interviewType?.toLowerCase().includes(query)
    );
  });

  if (loading && history.length === 0) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <Typography variant="h4" className="font-bold text-slate-100 font-sans" sx={{ fontFamily: "Outfit, Inter, sans-serif" }}>
          Interview History
        </Typography>
        <Typography variant="body2" className="text-slate-400 mt-1">
          Review your previous mock attempts, scores, and access detailed scorecard recommendations
        </Typography>
      </div>

      {error && (
        <Alert severity="error" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          {error}
        </Alert>
      )}

      {/* Toolbar filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <TextField
          placeholder="Filter by topic (e.g. Java, Python, SQL)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            className: "glass-input text-slate-100 w-80 max-w-full",
            startAdornment: <SearchIcon className="text-slate-500 mr-2" fontSize="small" />,
          }}
        />
        <Button
          variant="contained"
          onClick={() => navigate("/interview/start")}
          className="bg-primary hover:bg-primary-dark font-semibold px-5 py-2.5 rounded-lg text-sm shrink-0"
        >
          New Interview Practice
        </Button>
      </div>

      {/* History table */}
      <TableContainer component={Paper} className="bg-slate-800/40 border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <Table>
          <TableHead className="bg-slate-950/20">
            <TableRow>
              <TableCell className="text-slate-400 font-bold border-b border-white/5">Session ID</TableCell>
              <TableCell className="text-slate-400 font-bold border-b border-white/5">Category / Skill</TableCell>
              <TableCell className="text-slate-400 font-bold border-b border-white/5">Interview Focus</TableCell>
              <TableCell className="text-slate-400 font-bold border-b border-white/5">Difficulty</TableCell>
              <TableCell className="text-slate-400 font-bold border-b border-white/5">Overall Rating</TableCell>
              <TableCell className="text-slate-400 font-bold border-b border-white/5">Completed Date</TableCell>
              <TableCell className="text-slate-400 font-bold border-b border-white/5 text-right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-800/20 transition-colors">
                  <TableCell className="text-slate-300 border-b border-white/5 font-mono">#{row.id}</TableCell>
                  <TableCell className="text-slate-200 border-b border-white/5 font-semibold capitalize">{row.category}</TableCell>
                  <TableCell className="text-slate-300 border-b border-white/5 capitalize">{row.interviewType?.toLowerCase().replace("_", " ")}</TableCell>
                  <TableCell className="border-b border-white/5">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${
                      row.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      row.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {row.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="border-b border-white/5 font-bold text-slate-100 font-mono">
                    {row.score ? `${row.score.toFixed(0)}%` : "Pending/Null"}
                  </TableCell>
                  <TableCell className="text-slate-400 border-b border-white/5 text-xs">
                    {new Date(row.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}
                  </TableCell>
                  <TableCell className="border-b border-white/5 text-right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RemoveRedEyeIcon />}
                      onClick={() => navigate(`/interview/result/${row.id}`)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500 py-12 border-b border-white/5">
                  <div className="flex flex-col items-center gap-2">
                    <HistoryIcon className="text-4xl opacity-20" />
                    <Typography variant="body2">No previous mock sessions found.</Typography>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Mui Pagination helper */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="text-slate-400 border-t border-white/5 bg-slate-950/10"
          sx={{
            "& .MuiTablePagination-selectIcon": { color: "#94A3B8" },
            "& .MuiIconButton-root": { color: "#F8FAFC" },
          }}
        />
      </TableContainer>
    </div>
  );
};
