const plugin = require('tailwindcss/plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d'
      },
      boxShadow: {
        gradientbox:
          'inset 0 0 60px whitesmoke, inset 20px 0 80px #fef,  inset -20px 0 80px #0ff, inset 20px 0 300px #f0f, inset -20px 0 300px #0ff,  0 0 50px #fff, -10px 0 80px #f0f,  10px 0 80px #0ff'
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('flowbite/plugin'),
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4')
        }
      })
    })
  ]
}
