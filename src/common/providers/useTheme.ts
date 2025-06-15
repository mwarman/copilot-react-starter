import { useContext } from 'react';
import { ThemeProviderContext } from './ThemeContext';

/**
 * Hook for accessing the theme context.
 * @returns The theme context with current theme and setter
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
