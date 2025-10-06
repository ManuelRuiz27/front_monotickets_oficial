import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        primary: '#111827',
      },
    },
  },
  plugins: [],
} satisfies Config;
