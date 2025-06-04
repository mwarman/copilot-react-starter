import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Reset classes on document element before each test
    document.documentElement.classList.remove('light', 'dark');

    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');
  });

  const TestComponent = () => {
    const { theme, setTheme } = useTheme();
    return (
      <div>
        <div data-testid="theme-value">{theme}</div>
        <button onClick={() => setTheme('dark')} data-testid="set-dark">
          Set Dark
        </button>
        <button onClick={() => setTheme('light')} data-testid="set-light">
          Set Light
        </button>
        <button onClick={() => setTheme('system')} data-testid="set-system">
          Set System
        </button>
      </div>
    );
  };

  it('should use defaultTheme when no theme is stored', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('should use stored theme when available', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should apply system theme preference when set to system', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('system');

    // Mock matchMedia to simulate dark mode preference
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('system');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should update theme when setTheme is called', async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Initial state
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Change to dark theme
    await user.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('task-ui-theme', 'dark');
  });
});
