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
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
          light: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
        teal: {
          DEFAULT: '#0F766E',
          dark: '#115E59',
          light: '#14B8A6',
          50: '#F0FDFA',
          100: '#CCFBF1',
          700: '#0F766E',
        },
        success: {
          DEFAULT: '#16A34A',
          dark: '#15803D',
          light: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#D97706',
          dark: '#B45309',
          light: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          light: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F8FAFC',
          muted: '#F1F5F9',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
          dark: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.07)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}
