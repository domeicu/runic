/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#1C1C1E',
        light: {
          100: '#FFFFFF',
          200: '#8E8E93',
          300: '#3A3A3C',
        },
        dark: {
          100: '#1C1C1E',
          200: '#2C2C2E',
        },
        accent: '#007AFF',
      },
    },
  },
  plugins: [],
};
