import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

// Mock component to test the theme context
const TestComponent = () => {
  const { theme } = useTheme();
  return <div data-testid="theme-value">{theme}</div>;
};

describe('ThemeProvider', () => {
  // Mock localStorage
  const getItemMock = vi.fn();
  const setItemMock = vi.fn();

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemMock,
        setItem: setItemMock,
      },
      writable: true,
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: false, // Default to light mode
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
    });

    // Reset document root classes
    document.documentElement.classList.remove('light', 'dark');
  });

  it('uses the default theme when no localStorage value exists', () => {
    // Mock localStorage to return null (no stored theme)
    getItemMock.mockReturnValueOnce(null);

    const { getByTestId } = render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    // Check if default theme is used
    expect(getByTestId('theme-value').textContent).toBe('light');
    // Check if appropriate class is added to document
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('uses the theme from localStorage when available', () => {
    // Mock localStorage to return a stored theme
    getItemMock.mockReturnValueOnce('dark');

    const { getByTestId } = render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    // Check if localStorage theme is used
    expect(getByTestId('theme-value').textContent).toBe('dark');
    // Check if appropriate class is added to document
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it("uses system theme when set to 'system'", () => {
    // Mock localStorage to return "system"
    getItemMock.mockReturnValueOnce('system');

    // Mock matchMedia to simulate light mode preference
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: false, // Light mode
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Check if theme is "system"
    expect(getByTestId('theme-value').textContent).toBe('system');
    // Check if light class is added based on system preference
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('updates localStorage when theme changes', async () => {
    // Mock localStorage
    getItemMock.mockReturnValueOnce('light');

    // Setup user event
    const user = userEvent.setup();

    // Create a component with setTheme access
    const TestComponentWithButton = () => {
      const { setTheme } = useTheme();
      return (
        <button data-testid="theme-button" onClick={() => setTheme('dark')}>
          Change Theme
        </button>
      );
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponentWithButton />
      </ThemeProvider>,
    );

    // Click the button to change theme
    await user.click(getByTestId('theme-button'));

    // Verify localStorage was updated
    expect(setItemMock).toHaveBeenCalledWith('task-ui-theme', 'dark');
  });
});
