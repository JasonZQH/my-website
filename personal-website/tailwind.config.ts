// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // v3: one family (Kanit) everywhere — no monospace in the design.
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
