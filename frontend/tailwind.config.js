/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#0284c7',
          600: '#0265d2',
          700: '#034ea2',
          800: '#074182',
          900: '#0c3669',
          950: '#082247',
        },
        slate: {
          850: '#111c30',
          920: '#0b1324',
          950: '#060d1a',
        },
        safepay: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(2, 132, 199, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
        'modern': '0 10px 30px -10px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

