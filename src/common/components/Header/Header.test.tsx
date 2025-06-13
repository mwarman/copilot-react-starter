import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

// Mock the ThemeToggle component
vi.mock('../ThemeToggle/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-mock">ThemeToggle</div>,
}));

// Mock the ThemeProvider
vi.mock('@/common/providers/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

describe('Header', () => {
  it('renders the application name', () => {
    // Arrange
    render(<Header />);

    // Act
    const heading = screen.getByRole('heading', { name: /task hero/i });

    // Assert
    expect(heading).toBeInTheDocument();
  });

  it('renders the theme toggle', () => {
    // Arrange
    render(<Header />);

    // Act
    const themeToggle = screen.getByTestId('theme-toggle-mock');

    // Assert
    expect(themeToggle).toBeInTheDocument();
  });

  it('has the correct styling', () => {
    // Arrange
    render(<Header />);

    // Act
    const header = screen.getByRole('banner');

    // Assert
    expect(header).toHaveClass('w-full');
    expect(header).toHaveClass('bg-secondary');
    expect(header).toHaveClass('border-b');
  });
});
