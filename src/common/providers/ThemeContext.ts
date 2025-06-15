import { createContext } from 'react';

// Define the possible theme values
export type Theme = 'dark' | 'light' | 'system';

// State interface for the theme context
export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Initial state for the theme context
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

// Create the theme context
export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
