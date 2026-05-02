import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'border': 'border 4s linear infinite',
        'fade-up': 'fadeUp 500ms ease-out both',
        'fade-in': 'fadeIn 450ms ease-out both',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
      keyframes: {
        'border': {
          to: { '--border-angle': '360deg' },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translate3d(0, 10px, 0) scale(0.99)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 10px 40px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        talknest: {
          primary: "#22d3ee",
          secondary: "#a78bfa",
          accent: "#fb7185",
          neutral: "#0b1220",
          "base-100": "#070a12",
          "base-200": "#0b1220",
          "base-300": "#111b2e",
          info: "#38bdf8",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#fb7185",
        },
      },
      {
        cuteClean: {
          primary: "#fb7185",
          secondary: "#a78bfa",
          accent: "#22d3ee",
          neutral: "#121826",
          "base-100": "#0a0b12",
          "base-200": "#0f1322",
          "base-300": "#151a2e",
          info: "#60a5fa",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#fb7185",
        },
      },
      {
        vibrantFlashy: {
          primary: "#22d3ee",
          secondary: "#f472b6",
          accent: "#a78bfa",
          neutral: "#0b0f1a",
          "base-100": "#05060b",
          "base-200": "#090b14",
          "base-300": "#0f1222",
          info: "#38bdf8",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#fb7185",
        },
      },
      {
        whatsappClean: {
          primary: "#22c55e",
          secondary: "#14b8a6",
          accent: "#60a5fa",
          neutral: "#0b1220",
          "base-100": "#070a12",
          "base-200": "#0b1220",
          "base-300": "#111b2e",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#ef4444",
        },
      },
      "dark",
    ],
  },
};
