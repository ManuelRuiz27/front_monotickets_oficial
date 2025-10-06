import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#9333EA',
      },
    },
  },
  plugins: [],
} satisfies Config;
