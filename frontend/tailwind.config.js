/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9', // Violet
          light: '#8B5CF6',
          dark: '#4C1D95',
        },
        secondary: {
          DEFAULT: '#9333EA', // Purple
          light: '#A855F7',
          dark: '#581C87',
        },
        accent: {
          DEFAULT: '#F97316', // Orange
          light: '#FB923C',
          dark: '#C2410C',
        },
        background: '#0F172A', // Slate 900
        surface: {
          DEFAULT: '#111827', // Slate 950
          light: '#1F2937',
          dark: '#030712'
        },
        success: '#10B981', // Emerald 500
        danger: '#EF4444', // Red 500
        warning: '#F59E0B', // Amber 500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(100%)', opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(109, 40, 217, 0.4), 0 0 10px rgba(109, 40, 217, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(109, 40, 217, 0.8), 0 0 30px rgba(147, 51, 234, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
