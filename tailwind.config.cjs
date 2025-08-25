/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your teal CTA
        brand: {
          50:  "#E6FBF7",
          100: "#D1F7F0",
          200: "#A3EFE1",
          300: "#75E7D3",
          400: "#47DFC4",
          500: "#00C2A6",
          600: "#00AA90",
          700: "#008673",
          800: "#00685A",
          900: "#004D44",
          DEFAULT: "#00C2A6"
        },
        // NEW: Blue for the detections strip / icons (like your pic)
        feature: {
          50:  "#EAF2FF",
          100: "#DCE8FF",
          200: "#B9D1FF",
          300: "#96B9FF",
          400: "#6DA0FF",
          500: "#1463FF",   // main blue
          600: "#0F55DB",   // hover
          700: "#0C45B3",
          800: "#09368C",
          900: "#072A6D",
          DEFAULT: "#1463FF"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
