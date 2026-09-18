import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0a08",
        parchment: "#f3ead8",
        paprika: "#d85a1a",
        brass: "#e7c27d",
        sage: "#2f6f62",
        clay: "#1a1612",
        smoke: "#8a7f70",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(216, 90, 26, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
