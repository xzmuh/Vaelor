/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vaelor: { sky: '#8edcff', gold: '#e8b43b', deep: '#071a29' },
      },
    },
  },
  plugins: [],
}
