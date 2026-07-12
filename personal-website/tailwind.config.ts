// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // v3: one family (Kanit) everywhere — body is the only alias in use.
        body: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
