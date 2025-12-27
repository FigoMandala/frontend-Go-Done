/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Montserrat',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  safelist: [
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "border-red-300",
    "border-yellow-300",
    "border-green-300",
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};

