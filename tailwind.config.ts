import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Improved visibility palette
        background: "#0d1117",
        surface: "#1c2432",
        "surface-light": "#2d3748",
        "text-main": "#f7fafc",
        muted: "#a0aec0",
        primary: "#0ea5a4",
        accent: "#8b5cf6",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
