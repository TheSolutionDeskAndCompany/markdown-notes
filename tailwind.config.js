/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Default theme (blue)
        primary: colors.blue,
        // Purple theme
        purple: colors.purple,
        // Green theme
        emerald: colors.emerald,
        // Rose theme (pink/red)
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: theme => ({
        'gradient-primary': `linear-gradient(135deg, ${theme('colors.primary.500')} 0%, ${theme('colors.primary.700')} 100%)`,
        'gradient-purple': `linear-gradient(135deg, ${theme('colors.purple.500')} 0%, ${theme('colors.purple.700')} 100%)`,
        'gradient-emerald': `linear-gradient(135deg, ${theme('colors.emerald.500')} 0%, ${theme('colors.emerald.700')} 100%)`,
        'gradient-rose': `linear-gradient(135deg, ${theme('colors.rose.500')} 0%, ${theme('colors.rose.700')} 100%)`,
      }),
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
      },
      boxShadow: {
        'theme': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'theme-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
