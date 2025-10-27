/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#2196f3',  // Main primary
          600: '#1976d2',
          700: '#1565c0',
          900: '#0d47a1'
        },
        secondary: {
          500: '#ff5722',  // Main secondary
          600: '#f4511e',
        },
        // Sidebar/Navigation
        sidebar: {
          bg: '#1e293b',      // Dark background
          text: '#cbd5e1',    // Light text
          active: '#3b82f6',  // Active item
          hover: '#334155'    // Hover state
        },
        // Chart colors
        chart: {
          blue: '#2196f3',
          green: '#4caf50',
          orange: '#ff9800',
          red: '#f44336',
          purple: '#9c27b0',
          teal: '#009688'
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  }
}
