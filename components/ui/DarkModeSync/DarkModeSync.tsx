'use client';

import { useEffect } from 'react';

/**
 * Reads localStorage + system preference on mount and applies
 * the .dark class to <html>. Renders nothing — side-effect only.
 */
export function DarkModeSync() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = saved === 'dark' || (saved === null && prefersDark);
      document.documentElement.classList.toggle('dark', shouldBeDark);
    } catch {
      // Ignore environments without localStorage (SSR, private browsing)
    }
  }, []);

  return null;
}
