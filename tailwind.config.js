/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': '#20F3C7',
        'neon-blue': '#66C7DC',
        'card': '#252525',
        'card-hover': '#2e2e2e',
        'border-dark': '#333333',
        'bg-primary': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
