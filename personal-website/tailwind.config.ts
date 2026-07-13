// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  future: {
    // hover: variants only on devices that actually hover — touch taps must
    // not trigger the Stage-3 card interactions.
    hoverOnlyWhenSupported: true,
  },
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
