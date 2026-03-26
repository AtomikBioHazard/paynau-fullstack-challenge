/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paynau: {
          dark: '#0a1628',
          primary: '#1e3a5f',
          accent: '#01F5BA',
          card: '#1a2744',
          border: '#2a3a54'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
