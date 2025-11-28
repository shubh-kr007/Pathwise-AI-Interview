export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0a0e14', secondary: '#151b23', tertiary: '#1e2530' },
        sky: { 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7' },
        teal: { 400: '#2dd4bf', 500: '#14b8a6' },
        violet: { 400: '#a78bfa', 500: '#8b5cf6' },
      }
    },
  },
  plugins: [],
}