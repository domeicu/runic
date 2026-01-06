/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // This maps tailwind to your specific theme
        accent: {
          DEFAULT: '#deff63',
          light: '#b5d600',
        },
        dark: {
          100: '#1C1C1E',
          200: '#2C2C2E',
        },
      },
    },
  },
  plugins: [],
};
