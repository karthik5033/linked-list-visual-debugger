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
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
        // Default to dark
        setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('dsa-viz-theme', next ? 'dark' : 'light');
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
