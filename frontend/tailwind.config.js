/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060606",
        surface: "#0c0c0c",
        "surface-raised": "#141414",
        border: "#1a1a1a",
        "border-light": "#252525",
        primary: "#f0f0f0",
        secondary: "#777",
        muted: "#444",
        accent: {
          amber: "#e8a634",
          blue: "#3b82f6",
          green: "#22c55e",
          red: "#ef4444",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(232, 166, 52, 0.06)',
        'card': '0 1px 2px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
