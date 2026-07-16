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
          100: "var(--sn-accent-soft)",
          200: "var(--sn-accent-mist)",
          300: "var(--sn-accent-mist)",
          400: "var(--sn-accent)",
          500: "var(--sn-accent)",
          600: "var(--sn-accent)",
          700: "var(--sn-accent-hover)",
          800: "var(--sn-accent-hover)",
          900: "var(--sn-ink)",
          950: "var(--sn-ink)",
        },
        warm: {
          50: "var(--sn-bg)",
          100: "var(--sn-bg-elevated)",
          200: "var(--sn-surface-muted)",
          300: "var(--sn-line-strong)",
          400: "var(--sn-ink-faint)",
          500: "var(--sn-ink-muted)",
        },
        neutral: {
          50: "var(--sn-bg-elevated)",
          100: "var(--sn-surface-muted)",
          200: "var(--sn-line)",
          300: "var(--sn-line-strong)",
          400: "var(--sn-ink-faint)",
          500: "var(--sn-ink-muted)",
          600: "var(--sn-ink-muted)",
          700: "var(--sn-ink)",
          800: "var(--sn-ink)",
          900: "var(--sn-ink)",
          950: "var(--sn-ink)",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        display: ["var(--font-suit)", "var(--font-pretendard)", "sans-serif"],
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
        card: "var(--sn-shadow-1)",
        "card-hover": "var(--sn-shadow-2)",
        elevated: "var(--sn-shadow-2)",
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
