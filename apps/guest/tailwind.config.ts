import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        accent: '#9333EA',
      },
    },
  },
  plugins: [],
} satisfies Config;
