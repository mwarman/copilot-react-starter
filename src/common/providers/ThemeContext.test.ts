import { describe, it, expect } from 'vitest';
import { ThemeProviderContext, type Theme } from './ThemeContext';
import { useContext } from 'react';
import { renderHook } from '@testing-library/react';

describe('ThemeContext', () => {
  it('should export a React context', () => {
    // Check the structure of the exported context
    expect(ThemeProviderContext).toHaveProperty('Provider');
    expect(ThemeProviderContext).toHaveProperty('Consumer');
  });

  it('should define correct Theme type with all expected values', () => {
    // This is a type test - we're checking that our type definition is as expected
    // We need to create a variable with a union of all possible Theme values to verify
    const themeValues: Theme[] = ['dark', 'light', 'system'];

    // Assert - check we can assign all expected values to the type
    expect(themeValues).toHaveLength(3);
    expect(themeValues).toContain('dark');
    expect(themeValues).toContain('light');
    expect(themeValues).toContain('system');
  });

  it('should have the correct initial state when consumed', () => {
    // Create a hook that uses our context
    const { result } = renderHook(() => useContext(ThemeProviderContext));

    // Assert the initial state is as expected
    expect(result.current.theme).toBe('system');
    expect(typeof result.current.setTheme).toBe('function');
  });

  it('should not throw when calling the default setTheme function', () => {
    // Create a hook that uses our context
    const { result } = renderHook(() => useContext(ThemeProviderContext));

    // Assert - the default implementation should not throw
    expect(() => result.current.setTheme('dark')).not.toThrow();
  });
});
