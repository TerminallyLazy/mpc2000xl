import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-4 rounded-full bg-control-bg/90 backdrop-blur-sm text-control-text hover:bg-primary/20 transition-all shadow-xl border-2 border-primary/40 text-xl z-50"
      aria-label="Toggle theme"
      devinid="theme-toggle"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
