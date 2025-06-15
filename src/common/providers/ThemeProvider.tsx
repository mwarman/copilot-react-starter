import { useEffect, useState } from 'react';
import { ThemeProviderContext, type Theme } from './ThemeContext';

// Props for the ThemeProvider component
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

/**
 * ThemeProvider component to manage application theme.
 * Handles theme switching, storage in localStorage, and system preference detection.
 */
export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'task-ui-theme', // Using the specified storage key
  ...props
}: ThemeProviderProps) => {
  // Initialize theme state from localStorage or default
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  // Apply the theme to the document when it changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // If system theme, detect user preference
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);

      // Add listener for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (theme === 'system') {
          root.classList.remove('light', 'dark');
          root.classList.add(mediaQuery.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Apply the selected theme
      root.classList.add(theme);
    }
  }, [theme]);

  // Context value with theme state and setter
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};
