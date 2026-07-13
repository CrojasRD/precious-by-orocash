import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F1",
        ivory: "#F4EFE4",
        gold: {
          DEFAULT: "#B08D57",
          light: "#D9BE8E",
          dark: "#8C6C3F",
        },
        navy: {
          DEFAULT: "#0E1B2C",
          light: "#1B2C42",
        },
        charcoal: "#1A1A1A",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(14, 27, 44, 0.15)",
        gold: "0 10px 30px -10px rgba(176, 141, 87, 0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
