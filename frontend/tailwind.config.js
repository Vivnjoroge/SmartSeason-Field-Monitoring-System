export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f8f3',
          100: '#ddece1',
          200: '#bcd9c5',
          300: '#8fbc9f',
          400: '#5e9975',
          500: '#3d7d56',
          600: '#2d6343',
          700: '#255038',
          800: '#1f402e',
          900: '#1a3528',
          950: '#0e1d16',
        },
        cream: {
          50: '#fefdfb',
          100: '#faf7f1',
          200: '#f5efe1',
          300: '#ede0c7',
          400: '#e1ca9f',
          500: '#d0ab70',
          600: '#bf9053',
          700: '#a37544',
          800: '#855d3b',
          900: '#6d4d33',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
