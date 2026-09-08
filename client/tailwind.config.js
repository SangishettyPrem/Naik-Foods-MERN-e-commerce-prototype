/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F9F0',
          100: '#E4F4DF',
          200: '#C7E8BD',
          300: '#A3D995',
          400: '#70BF4F', // Primary Naik Foods Leaf Green
          500: '#5BA33E',
          600: '#46832E',
          700: '#356323',
          800: '#254619',
          900: '#15290E',
        },
        dark: {
          900: '#121411',
          800: '#161915', // Main text / headings
          700: '#232722',
          600: '#383D36',
          500: '#585E61', // Subtitles & muted text
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#FAFAF8',
          sage: '#F2F7F5',
          border: '#EAECE9',
        },
        spice: {
          mild: '#2E7D32',
          medium: '#F57C00',
          hot: '#D32F2F',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(22, 25, 21, 0.05)',
        'lift': '0 10px 30px -4px rgba(22, 25, 21, 0.08)',
        'brand': '0 8px 25px -4px rgba(112, 191, 79, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
