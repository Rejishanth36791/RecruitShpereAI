import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Lexend", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        base: {
          DEFAULT: "#050505",
          surface: "#111111",
          border: "#1F1F1F",
          elevated: "#161616",
        },
        indigo: {
          accent: "#6366F1",
        },
        violet: {
          accent: "#A855F7",
        },
        cyan: {
          accent: "#22D3EE",
        },
        success: "#10B981",
        danger: "#F43F5E",
        warn: "#F59E0B",
        ink: {
          DEFAULT: "#F1F5F9",
          muted: "#94A3B8",
          faint: "#64748B",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%)",
        "cyan-gradient": "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(99, 102, 241, 0.45)",
        "glow-cyan": "0 0 25px -5px rgba(34, 211, 238, 0.45)",
        "glow-danger": "0 0 25px -5px rgba(244, 63, 94, 0.45)",
        card: "0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite linear",
        "fade-in": "fade-in 0.35s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
