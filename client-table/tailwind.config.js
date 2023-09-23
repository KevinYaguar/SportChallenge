/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sport-red': '#d4000d',
        'sport-black': '#0b0d08',
        'sport-bg-yellow': '#ffd300',
        'sport-bg-gray': '#d2d2d2',
        'sport-bg-red': '#e20011',
      },
    }
  },
  plugins: [],
}
