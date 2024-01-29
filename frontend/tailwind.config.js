/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'redbg': '#EC202C',
        'darkbg': '#181A20',
      },
    },
  },
  plugins: [],
}

