/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A", // Deep OLED Black
        surface: "#111111", // Raised surface
        "surface-raised": "#1A1A1A", // Higher surface
        border: "#222222", // Subtle borders
        primary: "#FFFFFF", // High contrast text
        secondary: "#888888", // De-emphasized text
        accent: {
          amber: "#F5A623", // Cinematic gold/amber
          blue: "#3291FF", // Vercel-style blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(245, 166, 35, 0.1)',
      }
    },
  },
  plugins: [],
}
