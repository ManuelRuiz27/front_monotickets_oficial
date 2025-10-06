'use client';

import React, { useEffect } from 'react';
import { useToast } from '../hooks/useToast';

const typeStyles = {
  success: 'bg-[rgba(63,201,148,0.92)] text-white',
  error: 'bg-[rgba(242,95,92,0.92)] text-white',
  warning: 'bg-[rgba(255,173,79,0.92)] text-[#0d1b2a]',
  info: 'bg-[rgba(75,163,255,0.92)] text-white',
};

export const Toast = () => {
  const { message, type, isOpen, hideToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hideToast]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[999] flex max-w-sm justify-end">
      <div
        role="status"
        aria-live="assertive"
        className={`glass-popover pointer-events-auto flex-1 rounded-2xl px-5 py-4 text-sm font-medium shadow-soft transition-base ${typeStyles[type]}`}
      >
        {message}
      </div>
    </div>
  );
};
