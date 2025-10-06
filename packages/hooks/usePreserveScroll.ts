'use client';

import { useEffect } from 'react';

const STORAGE_PREFIX = 'monotickets-scroll:';

export function usePreserveScroll(key: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const stored = window.sessionStorage.getItem(storageKey);

    if (stored) {
      const top = Number.parseInt(stored, 10);
      if (!Number.isNaN(top)) {
        window.scrollTo({ top });
      }
    }

    const handleBeforeUnload = () => {
      window.sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.sessionStorage.setItem(storageKey, String(window.scrollY));
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [key]);
}
