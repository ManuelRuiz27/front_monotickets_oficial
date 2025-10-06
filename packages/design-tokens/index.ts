// Shared design tokens reflecting the refreshed Monotickets visual identity.
// These tokens centralize color, typography, and effect definitions so that
// all frontend surfaces stay consistent across applications.
export const tokens = {
  colors: {
    background: '#0D1B2A',
    backgroundMuted: '#11243A',
    surface: 'rgba(255, 255, 255, 0.08)',
    surfaceElevated: 'rgba(13, 27, 42, 0.75)',
    surfaceAlt: '#FFFFFF',
    text: '#B0B0B0',
    textStrong: '#FFFFFF',
    textMuted: '#8891A5',
    accent: '#4BA3FF',
    accentHover: '#6CB6FF',
    border: '#E0E0E0',
    borderSubtle: 'rgba(255, 255, 255, 0.18)',
    shadow: 'rgba(4, 9, 20, 0.45)',
  },
  typography: {
    headingFont: '"Montserrat", "Montserrat Variable", sans-serif',
    subheadingFont: '"Poppins", "Poppins Variable", sans-serif',
    bodyFont: '"Inter", "Inter Variable", "Roboto", system-ui, -apple-system, sans-serif',
    sizes: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      body: '16px',
    },
  },
  effects: {
    blur: '18px',
    glassOpacity: 0.75,
    transition: '200ms ease',
  },
};
