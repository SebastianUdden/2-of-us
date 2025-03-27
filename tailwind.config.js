/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slow-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "heart-pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        collapse: {
          "0%": {
            transform: "scaleY(1)",
            opacity: "1",
          },
          "50%": {
            opacity: "0",
          },
          "100%": {
            transform: "scaleY(0)",
            opacity: "0",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.9s ease-out",
        "slow-spin": "slow-spin 8s linear infinite",
        "heart-pulse": "heart-pulse 1.5s ease-in-out infinite",
        collapse: "collapse 0.9s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
