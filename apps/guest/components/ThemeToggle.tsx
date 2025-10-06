'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] shadow-soft transition-base hover:bg-[rgba(75,163,255,0.16)] hover:text-[var(--color-text-strong)]"
      aria-label={`Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`}
      aria-pressed={isLight ? 'true' : 'false'}
    >
      <span
        aria-hidden
        className="grid h-6 w-6 place-items-center rounded-full bg-[rgba(75,163,255,0.25)] text-[var(--color-text-strong)] transition-base group-hover:bg-[rgba(75,163,255,0.45)]"
      >
        {isLight ? '☀️' : '🌙'}
      </span>
      <span className="font-medium">{isLight ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
};
