/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e11d48',
          dark: '#be123c',
          light: '#fb7185',
        },
      },
    },
  },
  plugins: [],
}


