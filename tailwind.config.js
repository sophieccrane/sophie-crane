
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['ui-monospace', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

