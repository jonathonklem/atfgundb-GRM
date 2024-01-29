/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      'sans': ['Urbanist', 'sans-serif']
    },
    extend: {
      colors: {
        'redbg': '#EC202C',
        'darkbg': '#181A20',
        'altrow': 'rgba(101,196,250,.12)',
        'inputbg': '#1F222A',
        'inputfg': 'rgba(255,255,255,.6)',
      },
    },
  },
  plugins: [],
}

