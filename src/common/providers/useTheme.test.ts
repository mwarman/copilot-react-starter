import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProviderContext, type Theme } from './ThemeContext';
import { useTheme } from './useTheme';
import React from 'react';

// Create a wrapper to provide the ThemeContext
const createWrapper = (contextValue: { theme: Theme; setTheme: (theme: Theme) => void }) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(ThemeProviderContext.Provider, { value: contextValue }, children);
};

describe('useTheme', () => {
  it('returns the theme context when used within a ThemeProvider', () => {
    // Arrange
    const mockContextValue = {
      theme: 'dark' as Theme,
      setTheme: (_theme: Theme) => {
        // Mock implementation
      },
    };

    // Act
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(mockContextValue),
    });

    // Assert
    expect(result.current).toEqual(mockContextValue);
  });
});
