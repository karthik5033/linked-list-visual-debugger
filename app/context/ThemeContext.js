'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Flag to avoid hydration mismatch
    setMounted(true);

    // Check local storage
    const saved = localStorage.getItem('dsa-viz-theme');
    const initialDark = saved ? saved === 'dark' : true; // Default to dark

    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('dsa-viz-theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Prevent flash or mismatch during hydration if possible
  // But we render children anyway to avoid layout shift, just acceptable mismatch on classes potentially
  // Actually, for themes, usually we accept a flash or use next-themes. 
  // Custom simple implementation: use mounted flag to apply 'transition' classes only after mount?
  // Or just pass `isDark` down.

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
