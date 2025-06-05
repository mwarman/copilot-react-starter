import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the ThemeProvider to avoid matchMedia issues in tests
vi.mock('./common/providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock the Footer component
vi.mock('./common/components/Footer/Footer', () => ({
  Footer: () => <footer data-testid="footer">© 2025 learnBYdoing</footer>,
}));

describe('App component', () => {
  it('renders the header', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByRole('heading', { name: /task hero/i })).toBeInTheDocument();
  });

  it('renders the footer', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders headline', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument();
  });

  it('increments count when button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<App />);

    // Act
    const button = screen.getByRole('button', { name: /count is 0/i });
    await user.click(button);

    // Assert
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
  });
});
