/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        secondary: {
          DEFAULT: "#06B6D4",
          light: "#22D3EE",
          dark: "#0891B2",
        },
        slate: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          400: "#94A3B8",
          50: "#F8FAFC",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [],
}
