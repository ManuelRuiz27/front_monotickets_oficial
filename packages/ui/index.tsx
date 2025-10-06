import React from 'react';
import { Toast } from './components/Toast';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

// A simple button component with two variants.  Accepts children as the
// button label, an optional onClick handler, and an optional variant prop
// which defaults to "primary".  Styles are based on Tailwind CSS utility
// classes, but can be overridden or extended via the parent application.
export const Button = ({ children, onClick, variant = 'primary', disabled }: ButtonProps) => {
  const base = 'px-4 py-2 rounded font-semibold transition-all';
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300';
  return (
    <button onClick={onClick} className={`${base} ${styles}`} disabled={disabled}>
      {children}
    </button>
  );
};

// A simple card component for wrapping content.  Uses a white background,
// subtle shadow, and rounded corners.  Children are rendered inside.
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 bg-white shadow-md rounded-lg border border-gray-100">{children}</div>
);

export { Toast };
export * from './hooks';
