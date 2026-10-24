/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#334155'
        }
      }
    },
  },
  plugins: [],
}
