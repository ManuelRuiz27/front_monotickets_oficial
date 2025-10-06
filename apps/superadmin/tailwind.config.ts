import type { Config } from 'tailwindcss';

// Tailwind CSS configuration scoped to the Super Admin app.  Content paths
// include the app directory and any UI components from our internal ui package.
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
