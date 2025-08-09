/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121212', // Deep charcoal
        surface: '#1E1E1E',    // Slightly lighter charcoal for cards/surfaces
        brand: '#007BFF',      // Vibrant electric blue
        'brand-hover': '#0056b3', // Darker blue for hover
        prose: '#EAEAEA',      // Off-white for primary text
        muted: '#A0A0A0',      // Gray for secondary/muted text
        border: '#2D2D2D',     // Subtle border color
      },
    },
  },
  plugins: [],
};
