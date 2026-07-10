import { useState, useEffect } from 'react';

/**
 * usePrefersReducedMotion
 * ------------------------------------------------------------------
 * Tracks the user's OS-level "reduce motion" accessibility setting live —
 * updates if they change it while the app is open, not just on mount.
 * ------------------------------------------------------------------
 */
export default function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}
