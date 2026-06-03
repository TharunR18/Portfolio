/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        primary: '#0A0A0A',
        accent: '#C8A55A',
        secondary: '#EAEAEA',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'Geist', 'Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
