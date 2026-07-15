/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beauty: {
          rose: {
            light: '#fda4af', // rose-300
            DEFAULT: '#e11d48', // rose-600
            dark: '#881337', // rose-900
            deep: '#4c0519', // rose-950
          },
          gold: {
            light: '#fcd34d', // amber-300
            DEFAULT: '#f59e0b', // amber-500
            dark: '#d97706', // amber-600
          }
        },
        cosmetics: {
          copper: {
            light: '#ca8a04', // yellow-600
            DEFAULT: '#b45309', // amber-700
            dark: '#78350f', // amber-900
          },
          rose: {
            light: '#fce7f3', // rose-100
            DEFAULT: '#f472b6', // rose-400
            dark: '#db2777', // rose-600
          }
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
