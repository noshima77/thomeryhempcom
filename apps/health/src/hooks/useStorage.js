import { useState, useCallback } from "react";

/**
 * Hook générique de persistance localStorage.
 * @param {string} key   - clé localStorage
 * @param {any}    init  - valeur par défaut si rien en storage
 */
export function useStorage(key, init) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  const set = useCallback((next) => {
    setValue((prev) => {
      const val = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
      return val;
    });
  }, [key]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(key); } catch {}
    setValue(init);
  }, [key, init]);

  return [value, set, reset];
}
