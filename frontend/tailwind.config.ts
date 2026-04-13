import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007BFF", // Medical Blue
          dark: "#0056b3",
          light: "#EBF5FF",
        },
        secondary: {
          DEFAULT: "#0BB5B5", // Teal
          dark: "#088A8A",
          light: "#E6F8F8",
        },
        background: "#F4F7FB", // Clinic wall light gray-blue
        surface: "#FFFFFF",
        border: "#E1E5EE",
        text: {
          primary: "#1F2933",
          muted: "#6B7280",
        },
        status: {
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
        }
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }
    },
  },
  plugins: [],
};
export default config;
