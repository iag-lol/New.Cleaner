/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7fb',
          100: '#e8edf6',
          200: '#d3dbeb',
          300: '#b2c3dd',
          400: '#7b9ac3',
          500: '#4f74ac',
          600: '#325891',
          700: '#274673',
          800: '#233b5f',
          900: '#1f324f',
        },
      },
      boxShadow: {
        card: '0 10px 30px rgba(26, 86, 219, 0.08)',
      },
    },
  },
  plugins: [],
};
