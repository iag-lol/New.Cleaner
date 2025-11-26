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
        'card-hover': '0 20px 60px rgba(26, 86, 219, 0.15)',
        'glow-primary': '0 0 30px rgba(99, 102, 241, 0.4)',
        'glow-success': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glow-warning': '0 0 30px rgba(245, 158, 11, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        'gradient-danger': 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
        'gradient-info': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      },
    },
  },
  plugins: [],
};
