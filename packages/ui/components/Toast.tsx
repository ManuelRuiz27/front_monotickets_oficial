'use client';

import React, { useEffect } from 'react';
import { useToast } from '../hooks/useToast';

export const Toast = () => {
  const { message, type, isOpen, hideToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hideToast]);

  if (!isOpen) {
    return null;
  }

  const colors = {
    success: 'bg-green-600/90',
    error: 'bg-red-600/90',
    warning: 'bg-yellow-600/90',
    info: 'bg-blue-600/90',
  };

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`${colors[type]} text-white rounded-lg shadow-lg px-4 py-3`}>{message}</div>
    </div>
  );
};
