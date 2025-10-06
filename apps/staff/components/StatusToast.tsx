'use client';
import { useOfflineQueue } from '../lib/offlineQueue';
import React from 'react';

/**
 * Toast notification for showing success, warning, error or info messages
 * at the bottom right of the screen.  It reads the toast state from
 * useOfflineQueue and chooses a color based on the toast kind.
 */
export function StatusToast() {
  const { toast } = useOfflineQueue();
  if (!toast) return null;
  const color =
    toast.kind === 'success'
      ? 'bg-green-600/90'
      : toast.kind === 'warn'
        ? 'bg-yellow-600/90'
        : toast.kind === 'error'
          ? 'bg-red-600/90'
          : 'bg-blue-600/90';
  return (
    <div className="fixed bottom-4 right-4">
      <div data-testid="toast" className={`${color} text-white rounded-lg shadow-lg px-4 py-3`}>{toast.message}</div>
    </div>
  );
}
