import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-4 rounded-full bg-primary/20 backdrop-blur-md 
        text-control-text hover:bg-primary/40 transition-all shadow-2xl 
        border-2 border-primary/60 text-2xl z-50 animate-fade-in"
      aria-label="Toggle theme"
      devinid="theme-toggle"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
