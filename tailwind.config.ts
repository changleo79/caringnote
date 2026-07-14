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
        brand: {
          50: "var(--sn-accent-soft)",
          100: "#c5e4e1",
          200: "#9dd3ce",
          300: "var(--sn-accent-mist)",
          400: "#3f9e99",
          500: "#1f847f",
          600: "var(--sn-accent)",
          700: "var(--sn-accent-hover)",
          800: "#083633",
          900: "#062826",
          950: "#041a18",
        },
        warm: {
          50: "var(--sn-bg)",
          100: "var(--sn-bg-elevated)",
          200: "#ebe3d9",
          300: "#ddd2c4",
          400: "#c4b5a3",
          500: "#a89888",
        },
        neutral: {
          50: "var(--sn-bg-elevated)",
          100: "#efeae2",
          200: "#e2dbd1",
          300: "#cfc6ba",
          400: "var(--sn-ink-faint)",
          500: "var(--sn-ink-muted)",
          600: "#4a5452",
          700: "#343c3b",
          800: "var(--sn-ink)",
          900: "#121818",
          950: "#0a0e0e",
        },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', "sans-serif"],
        display: ['"SUIT Variable"', '"Pretendard Variable"', "sans-serif"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "600" }],
        heading: ["2rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        subheading: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", letterSpacing: "-0.01em" }],
        body: ["1rem", { lineHeight: "1.65", letterSpacing: "-0.01em" }],
        caption: ["0.875rem", { lineHeight: "1.5" }],
      },
      boxShadow: {
        card: "var(--sn-shadow)",
        "card-hover": "0 4px 16px rgba(28,36,35,0.06)",
        elevated: "0 10px 30px rgba(28,36,35,0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      animation: {
        "fade-in-up": "snFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
