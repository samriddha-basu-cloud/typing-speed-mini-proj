/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8', // Google-like blue
        secondary: '#fbbc05', // Google yellow
        accent: '#34a853', // Google green
        dark: '#202124', // Dark gray
        light: '#f1f3f4', // Light gray
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional font
      },
    },
  },
  plugins: [],
};

