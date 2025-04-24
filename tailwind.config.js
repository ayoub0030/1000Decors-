/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "walnut": "#522E1C",
        "sand": "#D9C2A3",
        "parchment": "#F7F2EC",
        "amazigh-red": "#A73A2F",
        "turquoise": "#2B8A84"
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
