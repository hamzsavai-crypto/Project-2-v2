/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "#07090d",
          panel: "#10151c",
          bezel: "#18212c",
          line: "#2a3646",
          phosphor: "#3ee0c4",
          amber: "#f0b429",
          rose: "#ff6b57",
          ink: "#e8eef5",
          mute: "#8b9bb0",
        },
      },
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px #2a3646, 0 24px 60px rgba(0,0,0,0.45)",
        glow: "0 0 24px rgba(62,224,196,0.18)",
      },
    },
  },
  plugins: [],
};
