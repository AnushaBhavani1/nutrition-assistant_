/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d3',
          300: '#86efb0',
          400: '#4ade87',
          500: '#22c563',
          600: '#16a34e',
          700: '#15803e',
          800: '#166534',
          900: '#14532b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(20, 83, 45, 0.08)',
      },
    },
  },
  plugins: [],
};
