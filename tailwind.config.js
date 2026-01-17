/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette
        'charcoal': {
          DEFAULT: '#1a1a1a',
          50: '#3d3d3d',
          100: '#333333',
          200: '#2b2b2b',
          300: '#242424',
          400: '#1f1f1f',
          500: '#1a1a1a',
          600: '#151515',
          700: '#111111',
          800: '#0d0d0d',
          900: '#0a0a0a',
        },
        'slate-dark': {
          DEFAULT: '#2d2d2d',
          50: '#5a5a5a',
          100: '#4f4f4f',
          200: '#424242',
          300: '#383838',
          400: '#323232',
          500: '#2d2d2d',
          600: '#252525',
          700: '#1e1e1e',
          800: '#181818',
          900: '#121212',
        },
        'amber': {
          DEFAULT: '#fbbf24',
          50: '#fef9e7',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'crimson': {
          DEFAULT: '#991b1b',
          50: '#fee2e2',
          100: '#fecaca',
          200: '#fca5a5',
          300: '#f87171',
          400: '#ef4444',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#6b1a1a',
        },
      },
      animation: {
        'fade-out': 'fadeOut 1s ease-out forwards',
        'pop': 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.4)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
