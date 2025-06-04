import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/common/providers/ThemeProvider';

// Mock the ThemeProvider hook
vi.mock('@/common/providers/ThemeProvider', () => ({
  useTheme: vi.fn().mockImplementation(() => ({
    theme: 'light',
    setTheme: vi.fn(),
  })),
}));

describe('ThemeToggle', () => {
  it('renders the theme toggle button', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    const mockSetTheme = vi.fn();

    // Mock the implementation for this specific test
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('shows correct button text based on current theme', () => {
    // Test with light theme
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    const { rerender } = render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();

    // Test with dark theme
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    });

    rerender(<ThemeToggle />);

    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
  });
});
