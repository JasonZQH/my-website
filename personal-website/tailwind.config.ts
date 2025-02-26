// tailwind.config.js
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/slider.js",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        gradientFlow: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        breathe: {
          '0%, 100%': {color: '#ffffff'},
          '50%': {color: '#000000'}
        }
      },
      animation: {
        gradientText: "gradientFlow 5s ease infinite",
        breathe: "breathe 2s ease-in-out infinite"
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require('daisyui'),],
};
