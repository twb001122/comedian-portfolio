/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFFFFF',
          DEFAULT: '#F5F2EA', // 米色
          dark: '#E5E0D5',
        },
        secondary: {
          light: '#4A4A4A',
          DEFAULT: '#333333', // 深灰
          dark: '#222222',
        },
        accent: {
          light: '#C0CDD6',
          DEFAULT: '#A9B7C0', // 蓝灰
          dark: '#8A9AA5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

