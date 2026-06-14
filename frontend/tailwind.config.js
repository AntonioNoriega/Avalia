/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand:  { DEFAULT: '#1E4D8C', dark: '#163a6b' },
        valor:  '#2E9E6B',
        acento: '#F2A93B',
        ink:    '#0F172A',
      },
      fontFamily: {
        display: ['Poppins', 'Segoe UI', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
