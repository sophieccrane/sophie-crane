
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Monaco"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

