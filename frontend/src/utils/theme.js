import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2563EB", // Blue
      light: "#3B82F6",
      dark: "#1D4ED8",
      contrastText: "#F8FAFC",
    },
    secondary: {
      main: "#06B6D4", // Cyan
      light: "#22D3EE",
      dark: "#0891B2",
      contrastText: "#0F172A",
    },
    background: {
      default: "#0F172A", // Slate 900
      paper: "#1E293B",   // Slate 800
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: "Outfit, Inter, sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Outfit, Inter, sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "Outfit, Inter, sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Outfit, Inter, sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "Outfit, Inter, sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "Outfit, Inter, sans-serif",
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.2s ease-in-out",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#1E293B",
          backgroundImage: "none",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.08)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.15)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563EB",
            },
          },
        },
      },
    },
  },
});

export default theme;
